const mongoDb = [];

const successResponse = {
    status: 200,
    data: {},
};

const errorResponse = {
    status: 500,
    error: {},
};

let id = 1;

// Create a notification. Line items may include current price of BTC, market trade volume, intra day high price, market cap 
const createNotification = (btcPrice, marketTradeVolume, highDayPrice, marketCap) => {
    const notification = {
        id: id++,
        btcPrice,
        marketTradeVolume,
        highDayPrice,
        marketCap,
        status: btcPrice < 100 ? 'failed' : 'outstanding',
    };
    mongoDb.push(notification);
    
    return btcPrice < 100 ? {
        ...errorResponse,
        data: { message: 'failed' }
    } : {
        ...successResponse,
        status: 201,
        data: notification
    };
};

// Send a notification to an email

const sendEmail = (id) => {
    const notification = mongoDb.find(item => item.id === id);
    if (!notification) return errorResponse;
    
    if (notification.status === 'outstanding') {
        notification.status = 'sent';
        return successResponse;
    } else {
        return errorResponse;
    }
};

const triggerEmail = (id) => {
    // create email data inclduing subjest, recipient, from, mailBody

    mongoDb.map(notification => {
        if(notification.id === id) 
            notification.btcPrice < 100? notification.status = 'failed' : notification.status = 'sent'
    })
}
// List sent notifications (sent, outstanding, failed etc.)
const getNotifications = () => {
    return mongoDb;
};


// Delete a notification
const deleteNotification = (id) => {
    const index = mongoDb.findIndex(item => item.id === id);
    if (index !== -1) {
        mongoDb.splice(index, 1);
        return {
            ...successResponse,
            data: { message: `Notification with id ${id} deleted` }
        };
    } else {
        return {
            ...errorResponse,
            error: { message: "Notification not found" }
        };
    }
};

createNotification('23.12', '10000', '150.00', '200');
createNotification('122.12', '10000', '150.00', '200');
createNotification('223.12', '10000', '150.00', '200');
createNotification('123.12', '10000', '150.00', '200');
createNotification('100.12', '10000', '150.00', '200');
createNotification('99.12', '10000', '150.00', '200');
createNotification('123.12', '10000', '150.00', '200');

sendEmail(1);
sendEmail(5);

console.log(getNotifications());

deleteNotification(7);

console.log(getNotifications());