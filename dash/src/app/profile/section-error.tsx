import { Alert } from "@heroui/react";

export function SectionError({ description, title }: SectionErrorProps) {
	return (
		<Alert status="danger">
			<Alert.Indicator />
			<Alert.Content>
				<Alert.Title>{title}</Alert.Title>
				<Alert.Description>{description}</Alert.Description>
			</Alert.Content>
		</Alert>
	);
}

interface SectionErrorProps {
	readonly description: string;
	readonly title: string;
}
