import { App, Modal } from "obsidian";
import { APP_TITLE } from "./config";
import LocalImagesPlugin from "./main";


export class ModalW1 extends Modal {

	plugin: LocalImagesPlugin;
	messg: string = "";
	callbackFunc: CallableFunction = null;
	 

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl, titleEl } = this;
		titleEl.setText(APP_TITLE);
		const div = contentEl.createDiv({
			text: this.messg
		})

		const btnContainer = contentEl.createDiv({ cls: "modal-btn-container" });

		btnContainer.createEl("button", {
			cls: ["mod-cta", "modal-btn"],
			text: "Cancel"
		}).addEventListener("click", async () => {
			this.close();
		});

		btnContainer.createEl("button", {
			cls: ["mod-cta", "modal-btn", "modal-btn-primary"],
			text: "Confirm"
		}).addEventListener("click", async () => {
			this.close();
			if (this.callbackFunc) {
				this.callbackFunc();
			}
		});
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}



export class ModalW2 extends Modal {

	plugin: LocalImagesPlugin;
	messg: string = "";

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl, titleEl } = this;
		titleEl.setText(APP_TITLE);
		const div = contentEl.createDiv({
			text: this.messg
		})

		const btnContainer = contentEl.createDiv({ cls: "modal-btn-container" });

		btnContainer.createEl("button", {
			cls: ["mod-cta", "modal-btn", "modal-btn-primary"],
			text: "OK"
		}).addEventListener("click", async () => {
			this.close();
		});
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
