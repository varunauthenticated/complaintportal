export class MsgConfigModel {
    private _rejectMsgJson: any =
        {
            investigationMsgForRejectLabel: 'Reason for RCA Cancellation',
            rcaMsgForRejectLabel: 'Reason for RCA Cancellation',
            caMsgForRejectLabel: 'Reason For CA Cancellation',
            paMsgForRejectLabel: 'Reason For PA Cancellation',
            investigationBtnForRejectLabel: 'Re-investigate',
            rcaBtnForRejectLabel: 'RCA',
            caBtnForRejectLabel: 'CA',
            paBtnForRejectLabel: 'PA'
        }

   
    get rejectMsgJson(): any {
        return this._rejectMsgJson;
    }
    set rejectMsgJson(rejectMsgJson: any) {
        this._rejectMsgJson = rejectMsgJson;
    }

  
}//end of class