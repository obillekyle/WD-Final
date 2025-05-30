export async function createPasskey() {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'Demo Site',
          id: window.location.hostname,
        },
        user: {
          id: Uint8Array.from('demo-user-id', (c) => c.charCodeAt(0)),
          name: 'demo@example.com',
          displayName: 'Demo User',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 }, // ES256
          { type: 'public-key', alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      },
    });

    console.log('Credential created (demo only!)', credential);
    alert('Passkey window completed ✅');
  } catch (err) {
    console.warn('User canceled or error happened ❌', err);
  }
}

export async function usePasskey() {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  try {
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        rpId: window.location.hostname,
      },
    });

    if (!credential) return false;

    return true;
  } catch (err) {
    console.warn('User canceled or error happened ❌', err);
    return false;
  }
}

// @ts-ignore
window.createPasskey = createPasskey;
// @ts-ignore
window.usePasskey = usePasskey;
