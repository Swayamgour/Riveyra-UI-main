// src/pages/legal/TermsOfService.jsx
import LegalPageLayout from "../components/LegalPageLayout";
import { legalConfig } from "../components/legalConfig";

const {
	companyName,
	legalEntityName,
	websiteUrl,
	contactEmail,
	address,
	governingLaw,
	jurisdiction,
	lastUpdated,
} = legalConfig;

const TermsOfService = () => {
	const sections = [
		{
			id: "acceptance",
			heading: "1. Acceptance of Terms",
			content: (
				<p>
					These Terms of Service ("Terms") govern your access to
					and use of {websiteUrl} (the "Website") and any services
					offered by {legalEntityName} ("{companyName}", "we",
					"us", or "our"). By accessing or using our Website, you
					agree to be bound by these Terms. If you do not agree,
					please do not use our Website or services.
				</p>
			),
		},
		{
			id: "eligibility",
			heading: "2. Eligibility",
			content: (
				<p>
					You must be at least 18 years old and capable of forming
					a legally binding contract to use our Website and
					services. By using our Website, you represent that you
					meet these requirements.
				</p>
			),
		},
		{
			id: "services",
			heading: "3. Services",
			content: (
				<p>
					We provide digital services including but not limited to
					web/app development, AI solutions, design, and related
					consulting services as described on our Website. The
					specific scope, deliverables, timelines, and fees for any
					engagement will be set out in a separate proposal,
					statement of work, or contract agreed upon between you
					and {companyName}. In case of any conflict between these
					Terms and a signed agreement, the signed agreement will
					prevail for that engagement.
				</p>
			),
		},
		{
			id: "account",
			heading: "4. Accounts & Access",
			content: (
				<p>
					If any part of our Website requires you to create an
					account, you are responsible for maintaining the
					confidentiality of your login credentials and for all
					activities that occur under your account. You agree to
					notify us immediately of any unauthorized use of your
					account.
				</p>
			),
		},
		{
			id: "payments",
			heading: "5. Fees & Payment",
			content: (
				<p>
					Where services are provided for a fee, pricing, payment
					schedules, and terms will be communicated in advance via
					a quote, invoice, or agreement. Unless otherwise agreed
					in writing, invoices are due within the timeframe stated
					on the invoice. Late payments may result in suspension
					of services and/or interest charges as permitted by
					applicable law.
				</p>
			),
		},
		{
			id: "intellectual-property",
			heading: "6. Intellectual Property",
			content: (
				<>
					<p>
						Unless otherwise agreed in a signed contract, all
						content on this Website — including text, graphics,
						logos, designs, code, and other materials — is the
						property of {companyName} or its licensors and is
						protected by applicable intellectual property laws.
					</p>
					<p>
						For client projects, ownership of final deliverables
						transfers to the client only upon full payment,
						unless otherwise specified in the project agreement.
						{companyName} retains the right to showcase completed
						work in its portfolio unless the client requests
						otherwise in writing.
					</p>
				</>
			),
		},
		{
			id: "acceptable-use",
			heading: "7. Acceptable Use",
			content: (
				<>
					<p>You agree not to:</p>
					<ul style={{ margin: 0, paddingLeft: 20 }}>
						<li>Use the Website for any unlawful purpose or in violation of these Terms</li>
						<li>Attempt to gain unauthorized access to our systems or networks</li>
						<li>Upload or transmit viruses, malware, or any harmful code</li>
						<li>Scrape, copy, or reproduce Website content without permission</li>
						<li>Impersonate any person or entity or misrepresent your affiliation</li>
						<li>Interfere with or disrupt the Website's functionality or security</li>
					</ul>
				</>
			),
		},
		{
			id: "third-party-links",
			heading: "8. Third-Party Links & Services",
			content: (
				<p>
					Our Website may contain links to third-party websites or
					services that are not owned or controlled by
					{" " + companyName}. We are not responsible for the
					content, privacy policies, or practices of any
					third-party websites or services.
				</p>
			),
		},
		{
			id: "disclaimers",
			heading: "9. Disclaimers",
			content: (
				<p>
					The Website and all services are provided on an "as is"
					and "as available" basis, without warranties of any
					kind, either express or implied, including but not
					limited to implied warranties of merchantability,
					fitness for a particular purpose, and non-infringement.
					We do not warrant that the Website will be uninterrupted,
					error-free, or completely secure.
				</p>
			),
		},
		{
			id: "limitation-liability",
			heading: "10. Limitation of Liability",
			content: (
				<p>
					To the fullest extent permitted by applicable law,{" "}
					{companyName} shall not be liable for any indirect,
					incidental, special, consequential, or punitive damages,
					or any loss of profits, revenue, data, or goodwill
					arising from your use of the Website or services, even
					if advised of the possibility of such damages. Our total
					liability for any claim arising out of these Terms shall
					not exceed the amount paid by you, if any, for the
					service giving rise to the claim.
				</p>
			),
		},
		{
			id: "indemnification",
			heading: "11. Indemnification",
			content: (
				<p>
					You agree to indemnify and hold harmless {companyName},
					its officers, directors, employees, and agents from any
					claims, damages, losses, liabilities, and expenses
					(including legal fees) arising from your use of the
					Website, your violation of these Terms, or your
					infringement of any third-party rights.
				</p>
			),
		},
		{
			id: "termination",
			heading: "12. Termination",
			content: (
				<p>
					We reserve the right to suspend or terminate your access
					to the Website or services at any time, without notice,
					for conduct that we believe violates these Terms or is
					harmful to other users, us, or third parties, or for any
					other reason at our sole discretion.
				</p>
			),
		},
		{
			id: "governing-law",
			heading: "13. Governing Law & Dispute Resolution",
			content: (
				<p>
					These Terms shall be governed by and construed in
					accordance with the laws of {governingLaw}, without
					regard to its conflict of law provisions. Any disputes
					arising out of or relating to these Terms shall be
					subject to the exclusive jurisdiction of the courts
					located in {jurisdiction}.
				</p>
			),
		},
		{
			id: "changes",
			heading: "14. Changes to These Terms",
			content: (
				<p>
					We may revise these Terms at any time by updating this
					page. Continued use of the Website after any changes
					constitutes your acceptance of the revised Terms. We
					encourage you to review this page periodically.
				</p>
			),
		},
		{
			id: "contact",
			heading: "15. Contact Us",
			content: (
				<>
					<p>
						If you have any questions about these Terms, please
						contact us:
					</p>
					<ul style={{ margin: 0, paddingLeft: 20, listStyle: "none" }}>
						<li>
							Email:{" "}
							<a
								href={`mailto:${contactEmail}`}
								style={{ color: "#60a5fa" }}
							>
								{contactEmail}
							</a>
						</li>
						<li>Address: {address}</li>
					</ul>
				</>
			),
		},
	];

	return (
		<LegalPageLayout
			title="Terms of Service"
			badge="Legal"
			lastUpdated={lastUpdated}
			sections={sections}
		/>
	);
};

export default TermsOfService;
