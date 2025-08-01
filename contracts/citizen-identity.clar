;; Citizen Identity Contract
;; Smart contract for managing verified citizen identities and reputation on-chain

;; Admin address
(define-data-var admin principal tx-sender)

;; Mapping: principal => (tuple (verified bool) (reputation int) (alias (optional (string-utf8 32))))
(define-map citizen-registry principal
  {
    verified: bool,
    reputation: int,
    alias: (optional (string-utf8 32))
  })

;; Constants
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-VERIFIED u101)
(define-constant ERR-NOT-REGISTERED u102)
(define-constant ERR-ALIAS-TOO-LONG u103)
(define-constant ERR-CITIZEN-NOT-VERIFIED u104)

;; Admin check
(define-private (is-admin)
  (is-eq tx-sender (var-get admin)))

;; Register a citizen (self-registration, not yet verified)
(define-public (register-citizen (alias (string-utf8 32)))
  (begin
    (match (map-get? citizen-registry tx-sender)
      some-entry (err ERR-ALREADY-VERIFIED)
      none
        (begin
          (map-set citizen-registry tx-sender {
            verified: false,
            reputation: 0,
            alias: (some alias)
          })
          (ok true)))))

;; Admin verifies a citizen
(define-public (verify-citizen (citizen principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (match (map-get? citizen-registry citizen)
      some entry
        (map-set citizen-registry citizen {
          verified: true,
          reputation: (get reputation entry),
          alias: (get alias entry)
        })
      none (err ERR-NOT-REGISTERED))
    (ok true)))

;; Read-only check if citizen is verified
(define-read-only (is-verified (citizen principal))
  (match (map-get? citizen-registry citizen)
    some entry (ok (get verified entry))
    none (ok false)))

;; Read-only get citizen reputation
(define-read-only (get-reputation (citizen principal))
  (match (map-get? citizen-registry citizen)
    some entry (ok (get reputation entry))
    none (err ERR-NOT-REGISTERED)))

;; Admin adjusts reputation manually (positive or negative)
(define-public (adjust-reputation (citizen principal) (delta int))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (match (map-get? citizen-registry citizen)
      some entry
        (map-set citizen-registry citizen {
          verified: (get verified entry),
          reputation: (+ (get reputation entry) delta),
          alias: (get alias entry)
        })
      none (err ERR-NOT-REGISTERED))
    (ok true)))

;; Citizens can update their alias
(define-public (update-alias (new-alias (string-utf8 32)))
  (match (map-get? citizen-registry tx-sender)
    some entry
      (map-set citizen-registry tx-sender {
        verified: (get verified entry),
        reputation: (get reputation entry),
        alias: (some new-alias)
      })
    none (err ERR-NOT-REGISTERED))
  (ok true))

;; Admin transfers admin role to another principal
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)))
