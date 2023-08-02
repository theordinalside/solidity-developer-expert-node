
const { CronJob } = require("cron");
const ads = require("../models/userAddsModel");
const vote = require("../models/vote");
const slotModel = require("../models/slotModel");
const moment = require('moment');
const settings = require('../models/setting');
let insArr = [
    "#41471",
    "#43264",
    "#44099",
    "#44592",
    "#44597",
    "#45315",
    "#45316",
    "#45366",
    "#45482",
    "#45643",
    "#45691",
    "#45701",
    "#46079",
    "#46083",
    "#46163",
    "#46173",
    "#46285",
    "#46292",
    "#46293",
    "#46299",
    "#46353",
    "#46356",
    "#48495",
    "#48498",
    "#48499",
    "#48533",
    "#48572",
    "#48574",
    "#48576",
    "#48577",
    "#48656",
    "#48657",
    "#48658",
    "#48659",
    "#48660",
    "#48662",
    "#48665",
    "#48688",
    "#48726",
    "#48729",
    "#49586",
    "#49587",
    "#49588",
    "#49589",
    "#49755",
    "#50226",
    "#50227",
    "#50228",
    "#50229",
    "#50231",
    "#50233",
    "#50234",
    "#50237",
    "#50238",
    "#50240",
    "#50242",
    "#50243",
    "#50244",
    "#50245",
    "#50247",
    "#50248",
    "#50458",
    "#50715",
    "#51909",
    "#52128",
    "#52130",
    "#52148",
    "#52149",
    "#52152",
    "#52157",
    "#52159",
    "#52163",
    "#52188",
    "#52189",
    "#52200",
    "#52201",
    "#52204",
    "#52208",
    "#53551",
    "#53590",
    "#53780",
    "#58910",
    "#58915",
    "#60991",
    "#60994",
    "#60997",
    "#61008",
    "#61011",
    "#61017",
    "#61051",
    "#61052",
    "#61070",
    "#61074",
    "#61075",
    "#61102",
    "#61111",
    "#61266",
    "#61291",
    "#61292",
    "#61306"
];

// let adsCron = new CronJob('00 00 * * *', async () => {
let adsCron = new CronJob('*/1 * * * *', async () => {
    console.log("in cron")

    let activeCount = 1, nextCount = 1;
    let [ActiveData, InActiveData, allData, price, x] = await Promise.all([
        ads.find(
            {
                status: "ACTIVE",
            }
        ),
        ads.find(
            {
                isNext: true,
                status: "ACTIVE",
            }
        ).sort({ inscription: 1 }),
        ads.find(
            {
                status: "ACTIVE",
            }
        ),
        settings.findOne({ type: "price" }),
        settings.findOne({ type: "limit" })
    ]);
    const limit = x == null ? 100 : x.value;
    price = price == 0 ? 0.0001 : price.value
    // console.log(allData.length, InActiveData.length, price)
    // if (allData.length > 0 && InActiveData.length > 0) {
    //     const lastIndex = InActiveData[InActiveData.length - 1];
    //     const resultOfIndex = allData.findIndex(x => String(x._id) === String(lastIndex._id));
    //     const newNextData = createChunks(allData, resultOfIndex + 1, limit);
    //     // Generate and print the shuffled numbers between 1 and 100
    //     const shuffledNumbers = generateShuffledNumbers(1, 100);

    //     for (let active of ActiveData) {
    //         await ads.findByIdAndUpdate({ _id: active._id }, { active: false, isNext: false, inscription: 0 });
    //     }
    //     for (let nextD of newNextData) {
    //         await ads.findByIdAndUpdate({ _id: nextD._id }, { active: false, isNext: true, inscription: nextCount });
    //         nextCount += 1;
    //     }
    //     for (let Inactive of InActiveData) {
    //         await ads.findByIdAndUpdate({ _id: Inactive._id }, { active: true, isNext: false, date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), inscription: shuffledNumbers[activeCount - 1], price: price, inscriptionNumber: insArr[Number(activeCount) - 1] });
    //         await userFunction(activeCount)
    //         // await vote.deleteMany()
    //         activeCount += 1;
    //     }
    //     activeCount = 1;
    //     nextCount = 1;
    // };

    if (ActiveData.length > 0) {
        const shuffledNumbers = generateShuffledNumbers(1, 100);
        for (let Inactive of ActiveData) {
            await ads.findByIdAndUpdate({ _id: Inactive._id }, { date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), inscription: shuffledNumbers[activeCount - 1], price: price, inscriptionNumber: insArr[Number(activeCount) - 1] });
            await userFunction(activeCount)
            // await vote.deleteMany()
            activeCount += 1;
        }
        activeCount = 1;
    };
});
adsCron.start();
function createChunks(array, index, limit) {
    let char = []
    var i = index,
        l = array.length;

    while (true) {
        if (i >= l) i = 0;
        char.push(array[i])
        if (char.length === limit) break;

        i += 1;
    }
    return char
}

async function userFunction(count) {
    let [ad, slot] = await Promise.all([
        ads.findOne(
            {
                inscription: count,
            }
        ),
        slotModel.findOne({
            inscription: count,
            status: "ACTIVE",
            updated: false
        })
    ]);

    if (ad && slot) {
        console.log(moment(slot.startDate).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD"), moment(slot.startDate).format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"))
        if (moment(slot.startDate).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
            await ads.findByIdAndUpdate(
                {
                    _id: ad._id
                }, {
                userUrl: slot.url,
                userTitle: slot.title,
                userClickTags: slot.clickTags == null ? "" : slot.clickTags,
                addedBy: "USER",
                userId: slot.userId,
                info: slot.info
            });
            await slotModel.findByIdAndUpdate({
                _id: slot._id
            }, {
                updated: true
            }, {
                new: true
            })
        };
        // if (moment(slot.endDate).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
        //     await Promise.all([
        //         ads.findByIdAndUpdate(
        //             {
        //                 _id: ad._id
        //             },
        //             {
        //                 userUrl: "",
        //                 userTitle: "",
        //                 userClickTags: "",
        //                 addedBy: "ADMIN"
        //             }),
        //         slotModel.findByIdAndUpdate(
        //             {
        //                 _id: slot._id
        //             }, {
        //             status: "INACTIVE"
        //         }
        //         )
        //     ]);
        // };
    }
}


function generateShuffledNumbers(min, max) {
    const numbers = Array.from({ length: max - min + 1 }, (_, index) => index + min);
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    console.log("24000-------------", numbers)
    return numbers;
}


