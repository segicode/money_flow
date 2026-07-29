"use strict";
function doGet() {
    return HtmlService
        .createTemplateFromFile("10_expence")
        .evaluate()
        .setTitle("pay_tracker : 支出データ")
        .addMetaTag("viewport", "width=device-width, initial-scale=1");
}
/*function doGet(e: { parameter: { page: any; }; }) {
    type Page = keyof typeof routes;
    const page = ((e && e.parameter && e.parameter.page) || "index") as Page;
    //if (typeof routes[page] !== "function") {
    if(!routes[page]){
        return render("index");
    }
    return routes[page]();
}

const routes = {
    index: () => render("index"),
    schedule: () => {
        /*if (() === []){
            const template = HtmlService.createTemplateFromFile("error");
            template.error = `scheduleシートに何もデータがありません。\nスプレットシートを確認してください。`;
            return template.evaluate()
                            .setTitle('My Workly：schedule')
                            .addMetaTag("viewport", "width=device-width, initial-scale=1");
        };
        const template = HtmlService.createTemplateFromFile("schedule");
        template.data = get_schedule_data();
        template.joblist = get_joblist();
        template.contentlist = get_contentlist();
        template.header = get_headerdata();
        return template.evaluate()
                        .setTitle('My Workly：schedule')
                        .addMetaTag("viewport", "width=device-width, initial-scale=1");
    },
};

function render(page: string) {
    return HtmlService
        .createTemplateFromFile(page)
        .evaluate()
        .setTitle("：index")
        .addMetaTag("viewport", "width=device-width, initial-scale=1");
};

function include(filename: string, data?: any | null) {
    const template = HtmlService.createTemplateFromFile(filename);
    template.data = data ?? null;

    return template.evaluate().getContent();
};*/ 
