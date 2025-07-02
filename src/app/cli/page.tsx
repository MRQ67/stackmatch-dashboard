import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react"; // Import the Download icon

export default function CliPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">StackMatch CLI Tool</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          The StackMatch CLI tool allows you to manage and interact with your development environments directly from your terminal.
          It provides powerful functionalities for scanning, comparing, and editing environment configurations.
        </p>
        <Link
          href="https://github.com/MRQ67/stackmatch-cli/releases/latest"
          passHref
          legacyBehavior>
          <Button size="lg" className="mb-12">
            <Download className="mr-2 h-4 w-4" /> Download Latest Release
          </Button>
        </Link>

        <div className="w-full max-w-4xl p-8 border rounded-lg bg-card text-left">
          <h2 className="text-2xl font-semibold mb-4">CLI Tool Information & Previews</h2>
          <p className="text-muted-foreground">
            -dummydata for now- This section will contain detailed information, usage examples, and visual previews of the StackMatch CLI tool.
            Stay tuned for updates!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}