import Script from "next/script";

export function ThemeScript() {
	return (
		<Script id="theme-init" strategy="beforeInteractive" src="/theme-init.js" />
	);
}
