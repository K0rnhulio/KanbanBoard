import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Candora Team Board",
    description: "Candora's shared team board — track tasks, assign members, add notes, and stay organized together.",
    openGraph: {
        title: "Candora Team Board",
        description: "Candora's shared team board — track tasks, assign members, add notes, and stay organized together.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Candora Team Board — collaborative task management",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Candora Team Board",
        description: "Candora's shared team board — track tasks, assign members, add notes, and stay organized together.",
        images: ["/og-image.png"],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
