const openpgp = require('openpgp')
const fs = require('fs')

async function generateKeys(name, email, secret) {
    let publicKey, privateKey
    try {
        privateKey = fs.readFileSync('./.private.txt')
        publicKey = fs.readFileSync('./.public.txt')
    } catch(e) {
        const { privateKeyArmored, publicKeyArmored, revocationCertificate } = await openpgp.generateKey({
            userIds: [{ name: name, email: email }],
            curve: 'ed25519',
            passphrase: secret
        });
        console.log(privateKeyArmored);
        console.log(publicKeyArmored);
        console.log(revocationCertificate);
        fs.writeFileSync('./.private.txt', privateKeyArmored)
        fs.writeFileSync('./.public.txt', publicKeyArmored)
        fs.writeFileSync('./.revoce.txt', revocationCertificate)
        privateKey = privateKeyArmored
        publicKey = publicKeyArmored
    }
    return {
        publicKey: publicKey,
        privateKey: privateKey
    }
}

async function getEncryptedText(text, publicKey) {
    const { data: encrypted } = await openpgp.encrypt({
        message: openpgp.message.fromText(text),
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys
    })
    console.log(encrypted)
    return encrypted
}

async function getDecryptedText(encrypted, secret) {
    passphrase = secret
    privKey = fs.readFileSync('./.private.txt')
    const { keys: [privateKey] } = await openpgp.key.readArmored(privKey);
    await privateKey.decrypt(passphrase);
    const { data: decrypted } = await openpgp.decrypt({
        message: await openpgp.message.readArmored(encrypted),
        privateKeys: [privateKey]
    });
    console.log(decrypted);
    return decrypted
}

function getPublicKey() {
    return fs.readFileSync('./.public.txt')
}

module.exports = {
    generateKeys: generateKeys,
    getEncryptedText: getEncryptedText,
    getDecryptedText: getDecryptedText,
    getPublicKey: getPublicKey
}