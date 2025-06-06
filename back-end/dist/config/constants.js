"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_URL = exports.ID = exports.TimeoutTimeInSeconds = exports.PATH_TO_OUTPUT_FOLDER = exports.PATH_TO_CODE_FOLDER = exports.SUPPORTED_LANGUAGES_OUTPUT_EXTENSIONS = exports.SUPPORTED_LANGUAGES_EXTENSIONS = exports.SUPPORTED_LANGUAGES = void 0;
exports.SUPPORTED_LANGUAGES = ["cpp", "java", "python", "c", "javascript"];
exports.SUPPORTED_LANGUAGES_EXTENSIONS = {
    cpp: "cpp",
    java: "java",
    python: "py",
    c: "c",
    javascript: "js",
};

exports.SUPPORTED_LANGUAGES_OUTPUT_EXTENSIONS = {
    cpp: "out",
    c: "out",
    java: "",
    python: "",
    javascript: "",
};

exports.PATH_TO_CODE_FOLDER = "../temp/code";
exports.PATH_TO_OUTPUT_FOLDER = "../temp/output";
exports.TimeoutTimeInSeconds = 20;

exports.ID = 1000;
exports.SERVER_URL = "https://code-verse.onrender.com";
