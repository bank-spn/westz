import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function CreateShipment() {
  useEffect(() => {
    // Auto redirect after 2 seconds
    const timer = setTimeout(() => {
      window.location.href = "https://dpostinter.thailandpost.com/#/label/form";
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Create Shipment</h1>
        <p className="text-gray-600">Redirecting to Thailand Post...</p>
      </div>

      <Card className="bg-white border-gray-300">
        <CardContent className="p-8 text-center">
          <ExternalLink className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Redirecting to Thailand Post</h3>
          <p className="text-gray-600 mb-4">
            You will be redirected to Thailand Post's shipment creation page.
          </p>
          <div className="text-sm text-gray-500">
            <p>Username: achira</p>
            <p>Password: 2605Bank</p>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            If you are not redirected automatically,{" "}
            <a
              href="https://dpostinter.thailandpost.com/#/label/form"
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              click here
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
