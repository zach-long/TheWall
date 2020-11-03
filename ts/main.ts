(() => {

    interface FormJSON {
        messageContent: string
    }

    interface MessageObject {
        _id: string,
        content: string
    }

    const wall: HTMLElement = document.getElementById('wall')!;
    const messageForm: HTMLFormElement = document.forms[0];
    const submitButton: HTMLInputElement = document.getElementById('postMessage')! as HTMLInputElement;
    
    async function asyncReq(url: string, method: 'get' | 'post', data?: FormJSON) {
        const response: Response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response.json();
    }

    function createMessage(message: MessageObject) {
        let div: HTMLDivElement = document.createElement('div');
        div.id = message._id;
        div.innerHTML = message.content;
        div.classList.add('message');
        wall.prepend(div);
    }

    function getMessages() {
        asyncReq('/api/all', 'get').then((result: Array<MessageObject>) => {
            console.log(result);
            var allMessages: Array<MessageObject> = result;
            
            allMessages.forEach((message: MessageObject) => {
                createMessage(message);
            });
        });
    }

    function postMessage() {
        const messageContent = document.getElementById('messageContent') as HTMLInputElement;

        const data: FormJSON = {messageContent: messageContent.value};

        asyncReq('/api/new', 'post', data).then((result: Response) => {
            console.log(result);
            messageForm.reset();
        });
    }

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        postMessage()
    });

    getMessages();

})();