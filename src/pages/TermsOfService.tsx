import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = "January 2024";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                By accessing and using AI ENERGY Optimizer (the "Service"), you accept and agree to be bound by these Terms of Service 
                ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
              </p>
              <p className="text-muted-foreground">
                These Terms constitute a legally binding agreement between you (the "User" or "you") and AI ENERGY Optimizer 
                (the "Company," "we," "us," or "our").
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                AI ENERGY Optimizer is an AI-powered platform that provides:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Energy load forecasting using advanced machine learning algorithms</li>
                <li>Demand response optimization and capacity planning</li>
                <li>Synthetic dataset generation for testing and analysis</li>
                <li>ESG (Environmental, Social, and Governance) reporting capabilities</li>
                <li>Real-time energy data visualization and analytics</li>
                <li>Integration with utility and enterprise energy management systems</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts and Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">3.1 Account Creation</h3>
                <p className="text-muted-foreground">
                  To use the Service, you must create an account and provide accurate, current, and complete information. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3.2 Account Security</h3>
                <p className="text-muted-foreground">
                  You are solely responsible for all activities that occur under your account. You must immediately notify us 
                  of any unauthorized use of your account or any other security breach.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3.3 Eligibility</h3>
                <p className="text-muted-foreground">
                  You must be at least 18 years old and have the legal capacity to enter into binding contracts to use the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. User Responsibilities and Conduct</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                As a user of the Service, you agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate and truthful information about your energy systems and operations</li>
                <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
                <li>Not attempt to gain unauthorized access to any part of the Service</li>
                <li>Not interfere with or disrupt the Service or servers</li>
                <li>Not use the Service to transmit malicious code or harmful content</li>
                <li>Not reverse engineer, decompile, or attempt to extract the source code of the Service</li>
                <li>Maintain appropriate security measures for your energy data and systems</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">5.1 Our Intellectual Property</h3>
                <p className="text-muted-foreground">
                  The Service, including all content, features, functionality, software, algorithms, and AI models, is owned by 
                  the Company and is protected by international copyright, trademark, patent, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">5.2 Your Data</h3>
                <p className="text-muted-foreground">
                  You retain all rights to the energy data and information you provide to the Service. By using the Service, 
                  you grant us a limited license to use your data solely for the purpose of providing and improving the Service.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">5.3 Feedback</h3>
                <p className="text-muted-foreground">
                  Any feedback, suggestions, or ideas you provide about the Service may be used by us without any obligation 
                  to you.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Payment and Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">6.1 Fees</h3>
                <p className="text-muted-foreground">
                  Certain features of the Service require payment of fees. All fees are non-refundable unless otherwise stated. 
                  We reserve the right to change our fees at any time with reasonable notice.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">6.2 Billing</h3>
                <p className="text-muted-foreground">
                  You agree to provide current, complete, and accurate billing information. You authorize us to charge your 
                  payment method for all fees incurred under your account.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">6.3 Cancellation</h3>
                <p className="text-muted-foreground">
                  You may cancel your subscription at any time. Cancellation will take effect at the end of your current 
                  billing period.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Service Availability and Modifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                We strive to provide reliable service, but we do not guarantee:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Uninterrupted or error-free operation of the Service</li>
                <li>That the Service will meet all your specific requirements</li>
                <li>The accuracy, reliability, or completeness of forecasts and recommendations</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time with reasonable notice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
                INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Warranties regarding the accuracy or reliability of forecasts and optimization recommendations</li>
                <li>Warranties that the Service will achieve specific energy savings or cost reductions</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                You acknowledge that energy optimization decisions should be made in consultation with qualified energy 
                professionals and that our Service provides decision support tools, not definitive guidance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Energy costs, penalties, or operational losses resulting from use of the Service</li>
                <li>Equipment damage or system failures related to optimization recommendations</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Our total liability for all claims related to the Service shall not exceed the amount you paid us in the 
                twelve (12) months preceding the claim.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You agree to indemnify, defend, and hold harmless the Company and its officers, directors, employees, and 
                agents from any claims, liabilities, damages, losses, and expenses arising from your use of the Service, 
                violation of these Terms, or infringement of any third-party rights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Data Privacy and Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to our 
                collection, use, and disclosure of your information as described in the Privacy Policy. You are responsible 
                for ensuring that your use of the Service complies with applicable data protection and privacy laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Breach of these Terms</li>
                <li>Non-payment of fees</li>
                <li>Misuse of the Service</li>
                <li>At your request</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Upon termination, your right to use the Service will immediately cease, and you must cease all use of the Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Governing Law and Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">13.1 Governing Law</h3>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the United States and the 
                  State of California, without regard to its conflict of law provisions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">13.2 Dispute Resolution</h3>
                <p className="text-muted-foreground">
                  Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in 
                  accordance with the rules of the American Arbitration Association, except where prohibited by law.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>14. General Provisions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                <strong>Severability:</strong> If any provision of these Terms is found to be invalid or unenforceable, 
                the remaining provisions shall remain in full force and effect.
              </p>
              <p className="text-muted-foreground">
                <strong>Waiver:</strong> No waiver of any term of these Terms shall be deemed a further or continuing waiver 
                of such term or any other term.
              </p>
              <p className="text-muted-foreground">
                <strong>Assignment:</strong> You may not assign or transfer these Terms without our prior written consent. 
                We may assign these Terms without restriction.
              </p>
              <p className="text-muted-foreground">
                <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire 
                agreement between you and us regarding the Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>15. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting 
                the updated Terms on our website and updating the "Last Updated" date. Your continued use of the Service 
                after such changes constitutes your acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>16. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> legal@aienergyoptimizer.com</p>
                <p><strong>Address:</strong> AI ENERGY Optimizer, Legal Department</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}