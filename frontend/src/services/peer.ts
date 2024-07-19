class PeerService {
    private peer: RTCPeerConnection;

    constructor() {
        this.peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        'stun:stun.l.google.com:19302',
                        'stun:global.stun.twilio.com:19302'
                    ]
                }
            ]
        });
    }

    async getOffer() {
        if (this.peer) {
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        }
    }

    async getAnswer(offer: RTCSessionDescription) {
        if (this.peer) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(answer));
            return answer;
        }
    }

    async setRemoteDescription(desc: RTCSessionDescription) {
        if (this.peer) {
            await this.peer.setRemoteDescription(desc);
        } else {
            console.error("Peer connection is null or undefined.");
        }
    }
}

export default new PeerService();
