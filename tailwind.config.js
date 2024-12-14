/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.ts",
        "./resources/**/*.tsx",
    ],
    theme: {
        extend: {
            scrollBehavior: ['smooth'],
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: ["light"],
    },
};
