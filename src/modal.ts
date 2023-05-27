import { App, Modal, Notice} from "obsidian";
import { APP_TITLE } from "./config";
import LocalImagesPlugin from "./main";


export class ModalW1 extends Modal {
  plugin: LocalImagesPlugin;
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl, titleEl } = this;
		titleEl.setText(APP_TITLE);
		const div = contentEl.createDiv({
			text: "\r\nConfirm processing all pages.\r\n\r\n      "
		})


		contentEl.createEl("button", {
			cls: ["mod-cta"],
			text: "Cancel"
		}).addEventListener("click", async () => {
      this.close(); 
    } );


		contentEl.createEl("button", {
			cls: ["mod-cta"],
			text: "Confirm"
		}).addEventListener("click", async () => {
      this.close(); 
      this.plugin.processAllPages();
		});
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
