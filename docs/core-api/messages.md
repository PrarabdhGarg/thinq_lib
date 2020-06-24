# Messages API

- #### thinq.messages.broadcastMessageToRoom(message, args)
    > Send a message to all the peers that are online on the IPFS network

    Parameters:
    * message (String): The message that you want to send to everyone
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * void


- #### thinq.messages.broadcastMessageToAddressBook(message, args)
    > Send a message to all the user that are in your addressbook, irrespective of the fact they are online or not

    Parameters:
    * message (String): The message that you want to send to everyone 
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * void

- #### thinq.messages.sendMessageToUser(message, user, args)
    > Send a message to a particular user, irrespective of the fact they are online or not

    Parameters:
    * message (String): The message that you want to send
    * user (String): The IPFS id of the user you want to send the message to 
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * void


