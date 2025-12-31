import Image from "next/image";
import { Ellipse } from "../../components/ui/ellipse";
import { EntaratBtn } from "../../components/ui/entarat-btn";
import { Text } from "../../components/ui/text";
import { HERO, HOW_IT_WORKS } from "../../lib/constants";

function HowItWorksPink() {
	return (
		<div
			className="relative py-20 md:py-32 z-2"
			style={{
				background: "linear-gradient(to right, rgb(226 0 181), rgb(164 4 83))",
			}}
		>
			{/* Repeating Pattern Background */}
			<div
				className="absolute inset-0 opacity-5 pointer-events-none"
				style={{
					backgroundImage: "url('/patterns/bg_pattern_repeat.svg')",
					backgroundRepeat: "repeat",
					backgroundSize: "30% auto",
				}}
			/>

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
					{/* Left Side - Images */}
					<div className="relative flex flex-col gap-6 lg:block lg:h-full">
						{/* Image 1 - Top Left */}
						<div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl lg:w-[60%]">
							<Image
								src={HOW_IT_WORKS.images.step1.img}
								alt={HOW_IT_WORKS.images.step1.alt}
								fill
								className="object-cover"
								unoptimized
							/>
						</div>

						{/* Image 2 - Bottom Right (Overlapping on desktop) */}
						<div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl lg:absolute lg:bottom-0 lg:right-0 lg:w-[55%]">
							<Image
								src={HOW_IT_WORKS.images.step2.img}
								alt={HOW_IT_WORKS.images.step2.alt}
								fill
								className="object-cover"
								unoptimized
							/>
						</div>
					</div>

					{/* Right Side - Title and Steps */}
					<div className="flex flex-col justify-center">
						<Text variant="h2" textColor="white" className="mb-8">
							{HOW_IT_WORKS.title}
						</Text>

						<div className="space-y-6">
							{HOW_IT_WORKS.steps.map((step) => (
								<div key={step.title} className="flex gap-4">
									<div className="shrink-0">
										<span className="text-2xl">•</span>
									</div>
									<div className="flex-1">
										<Text variant="h3" textColor="white" className="mb-2">
											{step.title}
											{"emoji" in step && step.emoji && (
												<span className="ml-2 text-2xl">{step.emoji}</span>
											)}
										</Text>
										<Text variant="lead" textColor="white/90" leading="relaxed">
											{step.description}
										</Text>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export function HowItWorks() {
	return (
		<section id="how-it-works" className="relative w-full overflow-hidden">
			{/* Top Section - Pink Background */}
			<HowItWorksPink />
			{/* Bottom Section - Dark Gradient Background */}
			<div className="relative py-20 md:py-32 bg-main-bg">
				<Ellipse type="2" size="110vw" position={{ y: "0%", x: "0%" }} center />
				<Ellipse
					type="1"
					size="120%w"
					position={{ y: "50%", x: "100%" }}
					center
				/>

				{/* Grid Pattern Overlay */}
				<div
					className="absolute inset-0 opacity-30"
					style={{
						backgroundImage: "url('/lines_bg.svg')",
						backgroundPosition: "center",
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
					}}
				/>

				{/* Content */}
				<div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
					<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
						{/* Left Side - Title and Philosophy */}
						<div className="flex flex-col justify-center">
							<div className="mb-8 flex items-center gap-4">
								<Text variant="h2" textColor="white">
									{HOW_IT_WORKS.philosophy.title}
								</Text>
								<span className="text-4xl">
									{HOW_IT_WORKS.philosophy.emoji}
								</span>
							</div>

							<Text
								variant="lead"
								textColor="white"
								leading="relaxed"
								className="mb-8"
							>
								{HOW_IT_WORKS.philosophy.description}
							</Text>

							<EntaratBtn variant="primary" size="lg">
								<svg
									className="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									aria-label={HERO.gameControllerIcon.ariaLabel}
								>
									<title>{HERO.gameControllerIcon.title}</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								{HERO.buttons.createGame}
							</EntaratBtn>
						</div>

						{/* Right Side - Image */}
						<div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
							<Image
								src={HOW_IT_WORKS.images.step3.img}
								alt={HOW_IT_WORKS.images.step3.alt}
								fill
								className="object-cover"
								unoptimized
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
