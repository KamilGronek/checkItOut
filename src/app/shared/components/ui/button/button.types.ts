/**
 * Represents the available visual variants of the button component.
 * - 'flat': A button with a flat background color and no elevation.
 * - 'stroked': A button with an outlined border and transparent background.
 * - 'raised': A button with a colored background and elevation.
 * - 'icon': A circular button typically containing only an icon.
 * - 'text': A button with no background or outline, appearing as text only.
 */
type ButtonVariant = 'flat' | 'stroked' | 'raised' | 'icon' | 'text';

/**
 * Represents the available color themes for the button component.
 * These correspond to the Material Design color themes.
 * - 'primary': The primary color theme of the application.
 * - 'accent': The accent/secondary color theme of the application.
 * - 'warn': The warning color theme, typically used for destructive actions.
 */
type ButtonColor = 'primary' | 'accent' | 'warn';

export { ButtonVariant, ButtonColor };
