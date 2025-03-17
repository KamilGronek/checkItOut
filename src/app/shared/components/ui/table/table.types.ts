/**
 * Represents a column configuration for the table component.
 *
 * @typedef {Object} Column
 * @property {string} key - The property name in the data object to display in this column
 * @property {string} label - The display label for the column header (will be passed through translation)
 */
export type Column = {
    key: string;
    label: string;
};
