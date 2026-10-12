// sent to the server and a reference came back
router.push({ name: 'report-sent', params: { reference } })

// saved to the offline queue (no reference yet)
router.push({ name: 'report-sent', query: { queued: '1' } })