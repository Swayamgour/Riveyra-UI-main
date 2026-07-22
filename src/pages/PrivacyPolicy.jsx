// src/pages/legal/PrivacyPolicy.jsx
import LegalPageLayout from "../components/LegalPageLayout";
import { legalConfig } from "../components/legalConfig";

const {
	companyName,
	legalEntityName,
	websiteUrl,
	contactEmail,
	privacyEmail,
	address,
	lastUpdated,
} = legalConfig;

const PrivacyPolicy = () => {
	const sections = [
		{
			id: "introduction",
			heading: "1. Introduction",
			content: (
				<>
					<p>
						{legalEntityName} ("{companyName}", "we", "us", or
						"our") operates {websiteUrl} (the "Website" or
						"Service"). This Privacy Policy explains how we
						collect, use, disclose, and safeguard your
						information when you visit our Website or use our
						services.
					</p>
					<p>
						By using our Website, you agree to the collection and
						use of information in accordance with this policy. If
						you do not agree with the terms of this Privacy
						Policy, please do not access the Website.
					</p>
				</>
			),
		},
		{
			id: "information-we-collect",
			heading: "2. Information We Collect",
			content: (
				<>
					<p>
						<strong>Information you provide to us:</strong> Name,
						email address, phone number, company details, project
						requirements, and any other information you
						voluntarily submit through our contact forms, career
						applications, newsletter sign-ups, or client
						onboarding process.
					</p>
					<p>
						<strong>Information collected automatically:</strong>{" "}
						IP address, browser type and version, device
						information, pages visited, time spent on pages,
						referring website, and other diagnostic data
						collected through cookies and similar tracking
						technologies.
					</p>
					<p>
						<strong>Information from third parties:</strong> We
						may receive information about you from analytics
						providers, advertising partners, and other third-party
						services we use to operate and improve our Website.
					</p>
				</>
			),
		},
		{
			id: "how-we-use",
			heading: "3. How We Use Your Information",
			content: (
				<>
					<p>We use the information we collect to:</p>
					<ul style={{ margin: 0, paddingLeft: 20 }}>
						<li>Provide, operate, and maintain our Website and services</li>
						<li>Respond to your inquiries, quotes, and support requests</li>
						<li>Process job applications submitted through our careers page</li>
						<li>Send you updates, marketing communications, and newsletters (with your consent, where required)</li>
						<li>Improve our Website's performance, content, and user experience</li>
						<li>Detect, prevent, and address technical issues, fraud, or abuse</li>
						<li>Comply with applicable legal obligations</li>
					</ul>
				</>
			),
		},
		{
			id: "cookies",
			heading: "4. Cookies & Tracking Technologies",
			content: (
				<p>
					We use cookies and similar tracking technologies to track
					activity on our Website and store certain information.
					For full details on the types of cookies we use and how
					you can control them, please see our{" "}
					<a href="/cookie-policy" style={{ color: "#60a5fa" }}>
						Cookie Policy
					</a>
					.
				</p>
			),
		},
		{
			id: "sharing",
			heading: "5. How We Share Your Information",
			content: (
				<>
					<p>
						We do not sell your personal information. We may
						share your information with:
					</p>
					<ul style={{ margin: 0, paddingLeft: 20 }}>
						<li>
							<strong>Service providers</strong> who perform
							services on our behalf (hosting, analytics, email
							delivery, payment processing)
						</li>
						<li>
							<strong>Business partners</strong> when necessary
							to deliver a project or service you have requested
						</li>
						<li>
							<strong>Legal authorities</strong> when required
							by law, court order, or to protect our rights,
							property, or safety
						</li>
						<li>
							<strong>Successors</strong> in the event of a
							merger, acquisition, or sale of assets
						</li>
					</ul>
				</>
			),
		},
		{
			id: "data-security",
			heading: "6. Data Security",
			content: (
				<p>
					We implement reasonable administrative, technical, and
					physical safeguards designed to protect your information
					from unauthorized access, disclosure, alteration, or
					destruction. However, no method of transmission over the
					internet or electronic storage is 100% secure, and we
					cannot guarantee absolute security.
				</p>
			),
		},
		{
			id: "data-retention",
			heading: "7. Data Retention",
			content: (
				<p>
					We retain your personal information only for as long as
					necessary to fulfil the purposes outlined in this Privacy
					Policy, unless a longer retention period is required or
					permitted by law (such as tax, accounting, or legal
					requirements).
				</p>
			),
		},
		{
			id: "your-rights",
			heading: "8. Your Rights",
			content: (
				<>
					<p>
						Depending on your location, you may have the right
						to:
					</p>
					<ul style={{ margin: 0, paddingLeft: 20 }}>
						<li>Access the personal information we hold about you</li>
						<li>Request correction of inaccurate information</li>
						<li>Request deletion of your personal information</li>
						<li>Object to or restrict certain processing</li>
						<li>Withdraw consent at any time (where processing is based on consent)</li>
						<li>Request a copy of your data in a portable format</li>
					</ul>
					<p>
						To exercise any of these rights, contact us at{" "}
						<a
							href={`mailto:${privacyEmail}`}
							style={{ color: "#60a5fa" }}
						>
							{privacyEmail}
						</a>
						.
					</p>
				</>
			),
		},
		{
			id: "third-party-links",
			heading: "9. Third-Party Links",
			content: (
				<p>
					Our Website may contain links to third-party websites or
					services that are not owned or controlled by us. We are
					not responsible for the privacy practices of these third
					parties. We encourage you to review the privacy policy of
					every website you visit.
				</p>
			),
		},
		{
			id: "childrens-privacy",
			heading: "10. Children's Privacy",
			content: (
				<p>
					Our Website is not intended for individuals under the age
					of 18. We do not knowingly collect personal information
					from children. If you become aware that a child has
					provided us with personal information, please contact us
					and we will take steps to delete such information.
				</p>
			),
		},
		{
			id: "changes",
			heading: "11. Changes to This Privacy Policy",
			content: (
				<p>
					We may update this Privacy Policy from time to time. Any
					changes will be posted on this page with an updated
					"Last updated" date. We encourage you to review this
					Privacy Policy periodically.
				</p>
			),
		},
		{
			id: "contact",
			heading: "12. Contact Us",
			content: (
				<>
					<p>
						If you have questions about this Privacy Policy or
						how we handle your information, please contact us:
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
			title="Privacy Policy"
			badge="Legal"
			lastUpdated={lastUpdated}
			sections={sections}
		/>
	);
};

export default PrivacyPolicy;
