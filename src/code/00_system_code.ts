function doGet(){
    return HtmlService
        .createTemplateFromFile("00_index")
        .evaluate()
        .setTitle("家計簿アプリ : money_flow")
        .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function get_all_data(){
    const pay_data = get_pay_data();
    return{
        pay_data: pay_data,
        work_data: null
    }
}

function include(filename: string) {
    const template = HtmlService.createTemplateFromFile(filename);

    return template.evaluate().getContent();
};
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
};*/
