
**ThinQueue: ThinQueue is no Queue**



ThinQ is a distributed and decentralized framework/App to reduce artificial scarcity, because queues become long when there is scarcity, which is often produced by creating artificial demand, in an otherwise abundant world.  The goal of this App is to make demands thinner and thinner by maximizing service providers between producers and consumers. ThinQueue is pronounced as "thin queue" (suggesting the effect of the app)



Phase 1: Expected behavior of the Core Engine:

     

   1. A service seeker (SS) installs ThinQueue.  Visits a service provider (SP) who also has the ThinQueueinstalled.  Does handshake through the app by sharing the QR code (hash) of the App. After the handshake is successful, SS gets added into SP's addressbook, and vice versa.
   1. When SS needs a service from SP, he sends a preformatted message to SP's App. SP's App registers the message, creates a TID (transaction ID), and sends a preformatted message to SS with a QN (queue number). 
   1. TID is linked to the UID (user ID) and are unique.  QN changes dynamically at SS-ThinQ as well as SP-ThinQ. 
   1. SP sets a proximal number range, a number of people who can wait without crowding at any given time, and is committed to serve. As soon as QN reaches the range, SS can visit SP to complete the transaction.  At this stage if SS does not want to complete the transaction, SS must withdraw from the Q, if SS does not withdraw, it is assumed that SS will visit SP. If SS does not turn up SS loses a social-trust-point (STP). This is not centralized point system, so do not worry!  To avoid confusion we may better call it PTP (Peer-to-peer trust point)
   1.  SS completes the transaction with SP, and the TID value is set to 1, meaning transaction completed. Both SS and SP will gain 1 PTP each.
6. The service need not be digital, it can be a cab service, book store, library or a provision store. 

A similar story is possible between a PR (producer) and a SS or SP. 



**Design requirements:**



ThinQueue will have no server, or every App instance is a server.



The same app to be used by the SS, SP as well as the PR (producer).

    

The data will remain within each ThinQueue instance. No centralization of data.  Best if this is developed over IPFS (distributed file system). After the transaction data can be destroyed or kept based on the choice of the owner of the app. 



During the transition stage ThinQueue may send notifications/alerts to regular messaging Apps like Telegram, SMS, WhatsApp, or email depending on the backends configured in the ThinQueue.    



**Use:**



What will be the use of the App?  

Starting from sending messages, sharing files, to serving services we can create Apps on top of this framework. All Apps could work without any central server, and central database.

The same app is used by PRs, SSs and SPs.  This is a general purpose app which can be used for anywhere people have to join in a transaction.

Eventually this will evolve to create a distributed network of ProSerMers. A ProSerMers is a term defined based on the three main economic roles any citizen in a society can play: producer, service provider or consumer.  Inspired from the  term "prosumer", which misses out the need for service providers in the model.  In order to make the goods and services abudandantly available, we need to distribute SPs, whose role is not dispensable.  (The idea is: don't eliminate the brokers from the system, but make them abundant, this will reduce scarcity and broker-monopoly which manipulates supply-demand chain to favor their interests.)  

