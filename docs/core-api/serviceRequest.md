# Service Request API

- #### thinq.serviceRequest.sentRequests(args)
    > Get a list of all service requests you have sent to others

    Parameters:
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * Object: The object has two fields:
        - requestType (String): This has a value Sent
        - requests (List<Object>): Every object in the list represents a request. Every object would contain the following fields:
            - sender: The name of the sender that you identify the user with
            - status: The status of the request
            - priority: The priority value of the request
            - display: 2 if the message is to displayed, else 1


- #### thinq.serviceRequest.pendingRequests(args, limit, offset)
    > Get all the list of all your requests that are pending

    Parameters:
    * args (Object): The object retrned from the thinq.thinQ.init function
    * limit (Int): The number of requests you want
    * offset (Int): The offset from where you want to start

    Returns:
    * Object: The object has two fields:
        - requestType (String): This has a value Pending
        - requests (List<Object>): Every object in the list represents a request. Every object would contain the following fields:
            - sender: The name of the sender that you identify the user with
            - status: The status of the request
            - priority: The priority value of the request
            - display: 2 if the message is to displayed, else 1

- #### thinq.serviceRequest.createdcRequests(args)
    > Returns a list of all the created close requests-whether as consumer or service provider

    Parameters:
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * Object: The object has two fields:
        - requestType (String): This has a value Created
        - requests (List<Object>): Every object in the list represents a request. Every object would contain the following fields:
            - sender: The name of the sender that you identify the user with
            - status: The status of the request
            - priority: The priority value of the request
            - display: 2 if the message is to displayed, else 1

- #### thinq.serviceRequest.createdspRequests(args)
    > Returns a list of all the close requests to be acknowledged as an SP (Step 2)

    Parameters:
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * Object: The object has two fields:
        - requestType (String): This has a value CreatedSP
        - requests (List<Object>): Every object in the list represents a request. Every object would contain the following fields:
            - sender: The name of the sender that you identify the user with
            - status: The status of the request
            - priority: The priority value of the request
            - display: 2 if the message is to displayed, else 1

- #### thinq.serviceRequest.spackRequests(args)
    > Returns a list of all the close requests to be acknowledged as a consumer (Step 3)

    Parameters:
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * Object: The object has two fields:
        - requestType (String): This has a value SP_Acknowledged
        - requests (List<Object>): Every object in the list represents a request. Every object would contain the following fields:
            - sender: The name of the sender that you identify the user with
            - status: The status of the request
            - priority: The priority value of the request
            - display: 2 if the message is to displayed, else 1

- #### thinq.serviceRequest.cackRequests(args)
    > Returns a list of all the resolved requests

    Parameters:
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * Object: The object has two fields:
        - requestType (String): This has a value Resolved
        - requests (List<Object>): Every object in the list represents a request. Every object would contain the following fields:
            - sender: The name of the sender that you identify the user with
            - status: The status of the request
            - priority: The priority value of the request
            - display: 2 if the message is to displayed, else 1

- #### thinq.serviceRequest.addRequests(sender_ipfs, args)
    > Sends requests to the SP

    Parameters:
    * sender_ipfs (String): The IPFS id of the user you want to send the request to
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * void

- #### thinq.serviceRequest.deleteRequests(sender_name, args)
    > Deletes request

    Parameters:
    * sender_name (String): Name of the user whose request you want to delete
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * void

- #### thinq.serviceRequest.createcRequests(sender_name, args)
    > Initiates the resolution process from consumer's side and creates a close request

    Parameters:
    * sender_name (String): Name of the user
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * void

- #### thinq.serviceRequest.spcreatecRequests(args)
    > Initiates the resolution process from SP's side

    Parameters:
    * sender_name (String): Name of the user
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * void

- #### thinq.serviceRequest.sp_ack_request(sender_name, userRating, documentPath, args)
    > The other party acknowledges the request and rates the party which initiated the process

    Parameters:
    * sender_name (String): Name of the user
    * userRating (Double): The rating given by Service Provider to the Consumer
    * documentPath (String): The path of the document where ratings are stored
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * void

- #### thinq.serviceRequest.c_ack_request(sender_name, userRating, documentPath, args)
    > The party which initiated the process completes it and rated the other party

    Parameters:
    * sender_name (String): Name of the user
    * userRating (Double): The rating given by Service Provider to the Consumer
    * documentPath (String): The path of the document where ratings are stored
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * void