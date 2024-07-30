import { Record } from "@mail/core/common/record";
import { onChange } from "@mail/utils/common/misc";
import { browser } from "@web/core/browser/browser";
import { _t } from "@web/core/l10n/translation";

export class DiscussApp extends Record {
    static new(data) {
        /** @type {import("models").DiscussApp} */
        const res = super.new(data);
        Object.assign(res, {
            channels: {
                extraClass: "o-mail-DiscussSidebarCategory-channel",
                icon: "fa fa-hashtag",
                id: "channels",
                name: _t("Channels"),
                canView: true,
                canAdd: true,
                sequence: 10,
                serverStateKey: "is_discuss_sidebar_category_channel_open",
                addTitle: _t("Add or join a channel"),
                addHotkey: "c",
            },
            chats: {
                extraClass: "o-mail-DiscussSidebarCategory-chat",
                icon: "fa fa-users",
                id: "chats",
                name: _t("Direct messages"),
                canView: false,
                canAdd: true,
                sequence: 30,
                serverStateKey: "is_discuss_sidebar_category_chat_open",
                addTitle: _t("Start a conversation"),
                addHotkey: "d",
            },
        });
        const isDiscussSidebarCompact =
            browser.localStorage.getItem("mail.user_setting.discuss_sidebar_compact") === "true";
        res.isSidebarCompact = isDiscussSidebarCompact;
        onChange(res, "isSidebarCompact", () => {
            if (res.isSidebarCompact) {
                browser.localStorage.setItem(
                    "mail.user_setting.discuss_sidebar_compact",
                    res.isSidebarCompact.toString()
                );
            } else {
                browser.localStorage.removeItem("mail.user_setting.discuss_sidebar_compact");
            }
        });
        return res;
    }
    /** @returns {import("models").DiscussApp} */
    static get(data) {
        return super.get(data);
    }
    /** @returns {import("models").DiscussApp|import("models").DiscussApp[]} */
    static insert(data) {
        return super.insert(...arguments);
    }

    /** @type {'main'|'channel'|'chat'|'livechat'} */
    activeTab = "main";
    searchTerm = "";
    isActive = false;
    isSidebarCompact = false;
    allCategories = Record.many("DiscussAppCategory", {
        inverse: "app",
        sort: (c1, c2) =>
            c1.sequence !== c2.sequence
                ? c1.sequence - c2.sequence
                : c1.name.localeCompare(c2.name),
    });
    thread = Record.one("Thread");
    channels = Record.one("DiscussAppCategory");
    chats = Record.one("DiscussAppCategory");
    hasRestoredThread = false;
}

DiscussApp.register();
