"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, RotateCcw, Scan } from 'lucide-react';
import jsQR from "jsqr";
import crypto from "crypto";

// IMPORTANT: Ensure you have this script tag in your root layout file (e.g., app/layout.tsx)


function decrypt(encryptedData) {
    const key = Buffer.from("1234567890abcdef1234567890abcdef", "utf8"); 
    const algorithm = "aes-256-gcm";

  const [ivB64, tagB64, dataB64] = encryptedData.split(":");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const encryptedText = Buffer.from(dataB64, "base64");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}



export default function QRScanner() {
  const [scannedData, setScannedData] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false); // CHANGED: New state for success feedback
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const stopScanning = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning || scanSuccess) { // CHANGED: Don't scan if success state is active
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (typeof jsQR !== 'undefined') {
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "attemptBoth",
        });

        // CHANGED: Handle successful scan with feedback
        if (code && code.data) {
          setScanSuccess(true); // Trigger the success UI
          cancelAnimationFrame(animationFrameRef.current); // Stop the scan loop immediately

          // After a short delay, process the data and switch views
          setTimeout(() => {
            console.log(code.data);
            let mess_url = `/api/verify/mess?phone=${code.data.slice(5)}`;
            let pro_url = `/api/verify/pro?email=${code.data.slice(4)}`;
            if (code.data.includes("mess")) {
              console.log(code.data)
              console.log(mess_url)
            }
            setScannedData(code.data);
            stopScanning();
            setScanSuccess(false); // Reset for next time
          }, 1000); // 1-second delay for feedback
          return;
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(scanQRCode);
  };

  const startScanning = async () => {
    setError('');
    setScannedData('');
    setVerificationResult(null);
    setScanSuccess(false); // CHANGED: Reset success state
    setIsScanning(true);

    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError(`Camera access denied: ${err.message}. Please allow camera permissions in your browser settings.`);
      setIsScanning(false);
    }
  };

  const verifyQRCode = async () => {
    if (!scannedData) return;
    setVerifying(true);
    setError('');
    let finalData = Buffer.from(scannedData, "base64").toString("utf8");


    // let finalData =  decrypt(scannedData); 
    let phone = "";
    let mess = "";
    let uri = "";
    console.log(finalData);
    if(finalData.includes("mess")){
      let parts = finalData.split("_");
      phone = parts[2];
      mess = parts[1];
      uri = `/api/verify/mess?phone=${phone}&messId=${mess}`;
    }else{
      // pro_email
      uri = `/api/verify/pro?email=${finalData.slice(4)}`;
    }

    try {
      const response = await fetch(`${uri}`);
      const result = await response.json();
      if (result.success) {
        setVerificationResult({
          success: response.ok,
          message: result.message || (response.ok ? 'Verification successful!' : 'Verification failed')
        });
      } else {
        setVerificationResult({
          success: response.ok,
          message: result.error || (response.ok ? 'Verification successful!' : 'Verification failed')
        });
      }

    } catch (err) {
      setError('Connection error: ' + err.message);
      setVerificationResult({ success: false, message: 'Failed to connect to server' });
    } finally {
      setVerifying(false);
    }
  };

  const rescan = () => {
    setScannedData('');
    setVerificationResult(null);
    setError('');
    startScanning();
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mt-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-3">
              <Scan className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">QR Scanner</h1>
            <p className="text-indigo-100 text-sm">Scan & Verify QR Codes</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className={`mb-6 ${isScanning ? 'block' : 'hidden'}`}>
              <div className="relative rounded-xl overflow-hidden bg-black" style={{ minHeight: '300px' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onCanPlay={() => scanQRCode()}
                  className="w-full"
                  style={{ minHeight: '300px', maxHeight: '500px', objectFit: 'cover', display: 'block', transform: 'scaleX(-1)' }}
                />
                <canvas ref={canvasRef} className="hidden" />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-64 h-64 border-4 border-white/80 rounded-2xl">
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
                  </div>
                </div>

                {/* CHANGED: Success Overlay */}
                {scanSuccess && (
                  <div className="absolute inset-0 bg-green-900 bg-opacity-75 flex flex-col items-center justify-center transition-opacity duration-300">
                    <CheckCircle className="w-20 h-20 text-white" />
                    <p className="text-white text-2xl font-bold mt-4">Scanned!</p>
                  </div>
                )}
              </div>

              <p className="text-center text-gray-600 mt-4 text-sm">
                Position QR code within the frame
              </p>

              <button
                onClick={stopScanning}
                disabled={scanSuccess} // CHANGED: Disable cancel button during success feedback
                className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 disabled:bg-red-300"
              >
                Cancel Scan
              </button>
            </div>

            {!isScanning && !scannedData && (
              <button
                onClick={startScanning}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <Camera className="w-6 h-6" />
                Start Scanning
              </button>
            )}

            {scannedData && !isScanning && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border-2 border-gray-200">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Scanned Succesfully</h3>
                  <p className="text-gray-900 font-mono text-sm break-all leading-relaxed">{Buffer.from(scannedData, "base64").toString("utf8")}</p>
                </div>

                {verificationResult && (
                  <div className={`p-4 rounded-xl flex items-start gap-3 ${verificationResult.success ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
                    {verificationResult.success ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`font-bold text-sm ${verificationResult.success ? 'text-green-900' : 'text-red-900'}`}>
                        {verificationResult.success ? '✓ Verified' : '✗ Failed'}
                      </h4>
                      <p className={`text-sm ${verificationResult.success ? 'text-green-700' : 'text-red-700'}`}>
                        {verificationResult.message}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={verifyQRCode}
                    disabled={verifying}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                  >
                    {verifying ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Verifying...
                      </span>
                    ) : (
                      'Verify'
                    )}
                  </button>

                  <button
                    onClick={rescan}
                    disabled={verifying}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Rescan
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Remember to replace the API endpoint in the code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}