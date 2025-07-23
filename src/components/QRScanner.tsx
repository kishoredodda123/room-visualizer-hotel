import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';

// Declare jsQR as a global variable (will be loaded from CDN)
declare global {
    interface Window {
        jsQR: any;
    }
}

interface QRScannerProps {
    isOpen: boolean;
    onClose: () => void;
    onResult: (result: string) => void;
    onError: (error: string) => void;
}

const QRScanner = ({ isOpen, onClose, onResult, onError }: QRScannerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [jsQRLoaded, setJsQRLoaded] = useState(false);
    const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load jsQR library dynamically
    const loadJsQR = () => {
        return new Promise<void>((resolve, reject) => {
            if (window.jsQR) {
                setJsQRLoaded(true);
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
            script.onload = () => {
                console.log('jsQR library loaded successfully');
                setJsQRLoaded(true);
                resolve();
            };
            script.onerror = () => {
                console.error('Failed to load jsQR library');
                reject(new Error('Failed to load jsQR library'));
            };
            document.head.appendChild(script);
        });
    };

    const startCamera = async () => {
        try {
            // Try to get the best camera settings for QR scanning
            const constraints = {
                video: {
                    facingMode: 'environment', // Use back camera if available
                    width: { ideal: 1280, min: 640 },
                    height: { ideal: 720, min: 480 },
                    focusMode: 'continuous',
                    advanced: [{ focusMode: 'continuous' }]
                }
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);

                // Wait for video to be ready
                videoRef.current.onloadedmetadata = () => {
                    console.log('Video loaded, starting QR scanning...');
                    setIsScanning(true);

                    // Start scanning after a short delay to ensure video is ready
                    setTimeout(() => {
                        scanIntervalRef.current = setInterval(() => {
                            scanForQRCode();
                        }, 250); // Scan every 250ms for better detection
                    }, 500);
                };
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            onError('Unable to access camera. Please check permissions and try again.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }

        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }

        setIsScanning(false);
    };

    const scanForQRCode = async () => {
        if (!videoRef.current || !canvasRef.current || !isScanning) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

        // Ensure canvas dimensions match video
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
            // Always try jsQR first as it's more reliable
            await detectWithJsQR(context, canvas.width, canvas.height);

            // Fallback to BarcodeDetector if jsQR doesn't find anything
            if ('BarcodeDetector' in window) {
                await detectWithBarcodeAPI(canvas);
            }
        } catch (error) {
            console.error('QR scanning error:', error);
        }
    };

    // Use browser's experimental Barcode Detection API
    const detectWithBarcodeAPI = async (canvas: HTMLCanvasElement) => {
        try {
            // @ts-ignore - BarcodeDetector is experimental but supported in Chrome/Edge
            const barcodeDetector = new BarcodeDetector({
                formats: ['qr_code']
            });

            const barcodes = await barcodeDetector.detect(canvas);

            if (barcodes.length > 0) {
                const qrCode = barcodes[0];
                console.log('QR Code detected:', qrCode.rawValue);
                onResult(qrCode.rawValue);
                stopCamera();
            }
        } catch (error) {
            console.error('Barcode detection error:', error);
        }
    };

    // Use jsQR library for QR code detection
    const detectWithJsQR = async (context: CanvasRenderingContext2D, width: number, height: number) => {
        try {
            // Ensure jsQR is loaded
            if (!window.jsQR) {
                if (!jsQRLoaded) {
                    await loadJsQR();
                }
                // Double check after loading
                if (!window.jsQR) {
                    return;
                }
            }

            const imageData = context.getImageData(0, 0, width, height);

            // Try different scanning options for better detection
            const scanOptions = [
                { inversionAttempts: "dontInvert" },
                { inversionAttempts: "onlyInvert" },
                { inversionAttempts: "attemptBoth" }
            ];

            for (const options of scanOptions) {
                const code = window.jsQR(imageData.data, width, height, options);

                if (code && code.data && code.data.trim()) {
                    console.log('QR Code detected with jsQR:', code.data);
                    onResult(code.data.trim());
                    stopCamera();
                    return;
                }
            }
        } catch (error) {
            console.error('jsQR detection error:', error);
        }
    };

    // Fallback QR pattern detection for browsers without BarcodeDetector
    const detectQRPatterns = (imageData: ImageData) => {
        const { data, width, height } = imageData;

        // Convert to grayscale for easier processing
        const grayscale = new Uint8Array(width * height);
        for (let i = 0; i < data.length; i += 4) {
            const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            grayscale[i / 4] = gray;
        }

        // Look for QR code finder patterns (the three squares in corners)
        const finderPatterns = findQRFinderPatterns(grayscale, width, height);

        if (finderPatterns.length >= 2) {
            console.log('Potential QR code detected, but full decoding requires specialized library');
            // In a real implementation, you would decode the QR data here
            // For now, we'll show that we detected a pattern but can't decode it
        }
    };

    // Simplified finder pattern detection
    const findQRFinderPatterns = (grayscale: Uint8Array, width: number, height: number): Array<{ x: number, y: number }> => {
        const patterns: Array<{ x: number, y: number }> = [];
        const threshold = 128;

        // Scan for the characteristic black-white-black pattern of QR finder patterns
        for (let y = 20; y < height - 20; y += 10) {
            for (let x = 20; x < width - 20; x += 10) {
                if (isLikelyFinderPattern(grayscale, width, x, y, threshold)) {
                    patterns.push({ x, y });
                    if (patterns.length >= 3) break;
                }
            }
            if (patterns.length >= 3) break;
        }

        return patterns;
    };

    // Check if a position might contain a QR finder pattern
    const isLikelyFinderPattern = (grayscale: Uint8Array, width: number, x: number, y: number, threshold: number): boolean => {
        const size = 10;
        if (x < size || y < size || x >= width - size || y >= height - size) return false;

        let darkPixels = 0;
        let totalPixels = 0;

        // Check a small area around the point
        for (let dy = -size; dy <= size; dy++) {
            for (let dx = -size; dx <= size; dx++) {
                const pixel = grayscale[(y + dy) * width + (x + dx)];
                if (pixel < threshold) darkPixels++;
                totalPixels++;
            }
        }

        // QR finder patterns have a specific ratio of dark to light pixels
        const darkRatio = darkPixels / totalPixels;
        return darkRatio > 0.4 && darkRatio < 0.6;
    };

    const handleManualInput = () => {
        const code = prompt('Enter QR code manually (for testing):');
        if (code) {
            onResult(code);
            stopCamera();
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Load jsQR library when scanner opens
            loadJsQR().catch(console.error);
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
    }, [isOpen]);

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        QR Code Scanner
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        <canvas
                            ref={canvasRef}
                            className="hidden"
                        />

                        {/* Scanning overlay */}
                        <div className="absolute inset-0 border-2 border-white/30 rounded-lg">
                            <div className="absolute inset-4 border-2 border-hotel-gold rounded-lg">
                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-hotel-gold rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-hotel-gold rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-hotel-gold rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-hotel-gold rounded-br-lg"></div>
                            </div>
                        </div>

                        {/* Scanning line animation */}
                        {isScanning && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-0.5 bg-hotel-gold animate-pulse"></div>
                            </div>
                        )}
                    </div>

                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Position the QR code within the frame to scan
                        </p>

                        <div className="flex gap-2 justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleManualInput}
                            >
                                Manual Input
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClose}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QRScanner;