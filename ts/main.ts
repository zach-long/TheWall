(() => {

    interface FormJSON {
        messageContent: string
    }

    interface MessageObject {
        _id: string,
        content: string
    }

    interface MessageResponse extends Response {
        message: MessageObject
        success: string,
        errors?: Array<{location: string, msg: string, param: string, value: string}>
    }

    // @ts-ignore
    const socket = io();

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

    function formatMessage(content: string) {
        console.log(`Formatting message: ${content}`);
        let formattedContent = content.replace(/(\n)/gm, '<br />');
        // let formattedContent = content.replace('\n', '<br />');
        console.log(`Formatted message: ${formattedContent}`);

        return formattedContent;
    }

    function createMessage(message: MessageObject) {
        console.log(`Creating message: ${message}`);
        let div: HTMLDivElement = document.createElement('div');
        let p: HTMLParagraphElement = document.createElement('p');

        div.id = message._id;

        let content = formatMessage(message.content);
        p.innerHTML = `${content}`;

        div.classList.add('message');
        
        console.log(`Created message: ${div.innerHTML}`);

        div.appendChild(p);
        wall.prepend(div);
    }

    function getMessages() {
        asyncReq('/api/all', 'get').then((result: Array<MessageObject>) => {
            var allMessages: Array<MessageObject> = result;
            
            allMessages.forEach((message: MessageObject) => {
                console.log(message);
                createMessage(message);
            });
        });
    }

    function postMessage() {
        const messageContent = document.getElementById('messageContent') as HTMLInputElement;

        const data: FormJSON = {messageContent: messageContent.value};

        asyncReq('/api/new', 'post', data)
        .then((result: MessageResponse) => {
            console.log(`POST success`);

            if (!result.errors) {
                console.log(`No errors triggered`);
                socket.emit('new message', result.message);

                messageForm.reset();
            } else {
                console.log(`Errors found`);
                console.log(result.errors);
                alert(result.errors[0].msg);
            }
            
        })
        .catch((error: Error) => {
            console.log(`POST error`);
            console.log(error);
        });
    }

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        postMessage()
    });

    socket.on('receive message', (message: MessageObject) => {
        createMessage(message);
    })

    getMessages();

})();