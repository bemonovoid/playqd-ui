class PageTitleUtils {
    setPageTitle(newTitle) {
        document.title = newTitle || 'Playqd';

    }
}

export const PAGE_TITLE_UTILS = new PageTitleUtils();