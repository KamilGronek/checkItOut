/**
 * Represents an option in a select dropdown.
 *
 * @typedef {Object} Option
 * @property {string} label - The text displayed to the user in the dropdown
 * @property {string|number|boolean} value - The value submitted with the form when this option is selected
 */
export type Option = {
    label: string;
    value: string | number | boolean;
}
