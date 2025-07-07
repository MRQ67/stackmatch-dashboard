'use client';

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, Terminal, Code, Cpu, Zap, GitBranch, Shield, Copy } from "lucide-react";
import { useState } from 'react';

const commands = [
  {
    command: 'stackmatch init',
    description: 'Initialize a new environment configuration',
    example: 'stackmatch init --name my-project --template node'
  },
  {
    command: 'stackmatch scan',
    description: 'Scan current directory for environment configurations',
    example: 'stackmatch scan --format json'
  },
  {
    command: 'stackmatch compare',
    description: 'Compare two environment configurations',
    example: 'stackmatch compare env1.yml env2.yml --output html'
  },
  {
    command: 'stackmatch sync',
    description: 'Synchronize local environment with cloud',
    example: 'stackmatch sync --env production --force'
  },
  {
    command: 'stackmatch validate',
    description: 'Validate environment configuration',
    example: 'stackmatch validate docker-compose.yml'
  }
];

const features = [
  {
    icon: <Terminal className="h-6 w-6 text-indigo-600 dark:text-primary" />,
    title: "Terminal First",
    description: "Designed for developers who live in the terminal with intuitive commands and flags."
  },
  {
    icon: <Code className="h-6 w-6 text-indigo-600 dark:text-primary" />,
    title: "Multiple Formats",
    description: "Support for JSON, YAML, and TOML configurations with easy conversion between them."
  },
  {
    icon: <Cpu className="h-6 w-6 text-indigo-600 dark:text-primary" />,
    title: "Fast & Efficient",
    description: "Optimized for performance with minimal dependencies and fast execution."
  },
  {
    icon: <Shield className="h-6 w-6 text-indigo-600 dark:text-primary" />,
    title: "Secure",
    description: "Built with security in mind, with support for environment variable encryption."
  }
];

const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 relative bg-zinc-900 rounded-md overflow-hidden">
      <div className="flex justify-between items-center bg-zinc-800 px-4 py-2">
        <span className="text-xs text-gray-300">{language}</span>
        <button
          onClick={copyToClipboard}
          className="text-gray-300 hover:text-white transition-colors"
          title="Copy to clipboard"
        >
          {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-100">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default function CliPage() {
  const [activeTab, setActiveTab] = useState('installation');

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black dark:bg-zinc-700 rounded-full mb-6">
            <Terminal className="h-10 w-10 text-indigo-600 dark:text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-4">
            StackMatch CLI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The command-line interface for managing your development environments with speed and precision.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="https://github.com/MRQ67/stackmatch-cli/releases/latest"
              passHref
              legacyBehavior>
              <Button size="lg" className="text-base">
                <Download className="mr-2 h-5 w-5" /> Download Latest
              </Button>
            </Link>
            <Link
              href="https://github.com/MRQ67/stackmatch-cli"
              passHref
              legacyBehavior>
              <Button size="lg" variant="outline" className="text-base dark:bg-zinc-700 dark:hover:bg-zinc-600">
                <GitBranch className="mr-2 h-5 w-5" /> View on GitHub
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['installation', 'usage', 'commands', 'examples'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary text-primary dark:text-primary dark:border-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, ' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-16">
          {activeTab === 'installation' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-zinc-700 shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Installation</h2>
                
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mt-6 mb-3">Using npm</h3>
                <CodeBlock code="npm install -g @stackmatch/cli" />
                
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mt-6 mb-3">Using Homebrew (macOS/Linux)</h3>
                <CodeBlock code={`brew tap stackmatch/cli 
brew install stackmatch`} />
                
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mt-6 mb-3">Using curl (Linux/macOS)</h3>
                <CodeBlock code="curl -sSL https://get.stackmatch.dev | sh" />
                
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mt-6 mb-3">Using PowerShell (Windows)</h3>
                <CodeBlock code="iwr -useb https://get.stackmatch.dev/install.ps1 | iex" />
                
                <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Note for Windows Users</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    On Windows, you might need to run PowerShell as Administrator and set the execution policy to allow script execution:
                  </p>
                  <CodeBlock code="Set-ExecutionPolicy RemoteSigned -Scope CurrentUser" language="powershell" />
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-700 shadow rounded-lg p-6">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Verify Installation</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  After installation, verify that the CLI is working by running:
                </p>
                <CodeBlock code="stackmatch --version" />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  You should see the version number of the installed CLI tool.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Basic Usage</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">Getting Help</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  To see all available commands and options:
                </p>
                <CodeBlock code="stackmatch --help" />
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-3">Initialize a New Project</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Start by creating a new environment configuration:
                </p>
                <CodeBlock code={`mkdir my-project
cd my-project
stackmatch init `}/>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-3">Scan Your Environment</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Scan your project to detect environment configurations:
                </p>
                <CodeBlock code="stackmatch scan" />
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-3">Sync with Cloud</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Log in and sync your environment with the cloud:
                </p>
                <CodeBlock code={`stackmatch login
stackmatch pull `}/>
              </div>
            </div>
          )}

          {activeTab === 'commands' && (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Commands</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Command
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Example
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {commands.map((cmd, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600 dark:text-indigo-400">
                            {cmd.command}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {cmd.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">
                            <code className="text-xs">{cmd.example}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Common Examples</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">Initialize a New Project</h3>
                <CodeBlock code={`# Create a new project directory
mkdir my-awesome-app
cd my-awesome-app

# Initialize with a specific template
stackmatch init --name my-awesome-app --template node`} />
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-3">Scan and Export</h3>
                <CodeBlock code={`# Scan current directory and export to JSON 
stackmatch scan --output environments.json

# Scan with verbose output
stackmatch scan -v

# Scan and format output as YAML
stackmatch scan --format yaml`}/>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-3">Compare Environments</h3>
                <CodeBlock code={`# Compare two environment files
stackmatch compare dev.env prod.env

# Generate HTML report
stackmatch compare dev.env prod.env --output report.html

# Compare with specific format
stackmatch compare dev.env prod.env --format markdown`}/>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-8 mb-3">Sync with Cloud</h3>
                <CodeBlock code={`# Log in to your account
stackmatch login

# Sync current environment
stackmatch sync

# Sync specific environment
stackmatch sync --env production

# Force sync (overwrite remote)
stackmatch sync --force`} />
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Why Use StackMatch CLI?</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-zinc-700 p-6 rounded-lg shadow">
                <div className="w-12 h-12 bg-zinc-700 dark:bg-zinc-600 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-800 sm:text-4xl mb-4">
            Ready to Supercharge Your Workflow?
          </h2>
          <p className="text-xl text-zinc-700 max-w-2xl mx-auto mb-8">
            Download the StackMatch CLI today and take control of your development environments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="https://github.com/MRQ67/stackmatch-cli/releases/latest"
              passHref
              legacyBehavior>
              <Button size="lg" className="bg-white text-zinc-600 hover:bg-indigo-50">
                <Download className="mr-2 h-5 w-5" /> Download Now
              </Button>
            </Link>
            <Link
              href="https://github.com/MRQ67/stackmatch-cli"
              passHref
              legacyBehavior>
              <Button size="lg" variant="outline" className="text-white dark:border-zinc-700 hover:bg-indigo-600">
                <GitBranch className="mr-2 h-5 w-5" /> View on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}