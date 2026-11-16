import { stagePage } from "@gerak/tools/pages";
stagePage(import.meta.glob("/*/src/*.ts"), import.meta.glob("/*/src/*.tsx"));
import.meta.hot?.accept();
