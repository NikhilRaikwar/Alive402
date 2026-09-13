# World Selfie Check integration feedback

## Integration flow

The IDKit 4.x documentation made the trust boundary clear: the RP signature belongs on the server, the complete result is forwarded unchanged to `/api/v4/verify/{rp_id}`, and the application must store and deduplicate nullifiers itself. The `selfieCheckLegacy()` preset name is easy to miss because Selfie Check is current beta functionality while the preset currently returns a World ID 3.0 proof.

## Developer Portal and product discovery

The separation between `app_id`, `rp_id`, and `signing_key` is documented well in the IDKit integration page. It would help if the Portal showed a ready-to-copy Selfie Check React snippet beside the feature flag and clearly displayed whether Sandbox and Selfie Check are enabled for the current app.

## Sandbox states tested

- Desktop web handoff through QR.
- Returning-user verification and proof delivery.
- Cancellation and expired request handling.
- Already-consumed application entitlement after a valid repeated proof.

Cold and semi-cold acquisition paths depend on the gated Sandbox app distribution. These should be tested on both Android and iOS before production launch.

## Errors and edge cases

Alive402 treats missing access, expired RP context, action mismatch, invalid proof, missing nullifier, and duplicate campaign enrollment as distinct product states. The UI never treats a successful camera flow alone as an entitlement; server verification and the application nullifier check must both succeed.

## Assurance language

Selfie Check is used as a medium-assurance liveness, facial-similarity, continuity, and abuse-resistance signal. Alive402 does not describe it as global proof of uniqueness and does not store selfie images.
