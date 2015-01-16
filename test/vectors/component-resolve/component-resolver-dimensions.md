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


## parent data

The parent data object is a reference directly into onm.Store data. It may or may not be initialized. It may or may not contain properties. If it contains properties, they will _generally_ correspond with declared entities in the onm data model. However, they do not have to. In the context of component resolution, the parent data object reference corresponds to the data object associated with a named extention point (the component's parent namespace by definition). What the parent dimension represents is then the registration (or framing if you prefer) of the parent namespace data, against the component's declared data model structure of which there are strategy*token (21) permutations.


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



