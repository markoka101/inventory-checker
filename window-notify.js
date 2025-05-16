const notifier = require("node-notifier");

function windowNotif() {
    // Basic notification if user has it turned on
    notifier.notify({
        title: "Stock Alert",
        message: "check if in stock",
        sound: true,
        wait: false,
    });
}

module.exports = { windowNotif };
