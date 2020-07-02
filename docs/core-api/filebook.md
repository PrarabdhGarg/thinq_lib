# Filebook API

- #### thinq.filebook.uploadfile(file, documentPath, fileName, args)
    > Add a file to the IPFS file system so that it can be shared with other peers

    Parameters:
    * file (Buffer): The contents of file you want to upload to the filebook
    * documentPath (String): The location of where to store the document within the IPFS file system
    * fileName (String): The name with which the file should be saved
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * String: The hash of the file added to the IPFS file system


- #### thinq.filebook.getFilebook(args)
    > Get all the list of all files stored in the IPFS file system

    Parameters:
    * args (Object): The object retrned from the thinq.thinQ.init function

    Returns:
    * List<Object>: Every object of the list contains:
        - ipfs_hash: The hash of the file to access it using the ipfs file system
        - name: The name of the file, as specified by the user while inserting the file


