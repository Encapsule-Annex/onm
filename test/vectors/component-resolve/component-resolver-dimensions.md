# onm component resolver test dimensions

## strategy string value dimension

values:

- undefined
- null
- not string
- invalid string
- S1 : 'create'
- S2 : 'open'
- S3 : 'negotiate'

## address token onm.AddressToken value dimension

values predicated on valid(value(dimension(strategy))):

- A1: R: level-0 component root namespace
- A2: RC: level-1 child namespace
- A3: RE: level-1 extension point namespace
- A4: RCC: level-1 child | level-2 child
- A5: RCE: level-1 child | level-2 extension point
- A6: RCCC: level-1 child | level-2 child | level-3 child
- A7: RCCE: level-1 child | level-2 child | level-3 extension point


## target namespace data initial state dimension

Note that the existing data (i.e. the store data) at the target namespace is a function of the parent data object reference passed to resolveComponent, and a function of the address token value.

- T1: empty parent object
- T2: parent data object contains target named object
- T3: 


## parent data






C:R :: N -- empty parent data object
C:R :: I -- parent data object contains named entity
C:R :: P0 -- named object exists, contains unmodeled properites
C:R :: P1 -- named object exists, contains modeled properties
C:R :: P2 -- named object exists, contains both modeled and unmodeled properties





C:RC
C:RE
C:RCC
C:RCE
C:RCCC
C:RCCE

O:R
O:RC
O:RE
O:RCC
O:RCE
O:RCCC
O:RCCE

N:R
N:RC
N:RE
N:RCC
N:RCE
N:RCCC
N:RCCE


## caller data object value dimension

predicate:value



