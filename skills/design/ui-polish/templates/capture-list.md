# Capture list

Capture every row each round. The marker is text that is visible once the view
has loaded, such as the main heading.

Defaults:

- 1440x900, light and dark.
- 1280x800 and 768x1024 for dense pages; 390x844 if the UI is used on mobile.
- States: focus, hover with tooltip, empty, error, loading.
- At least two detail crops of dense text per key page.

| File | Route | Theme | Viewport | State | Marker | Crop | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| a01.png | /jobs | light | 1440x900 | default | Jobs | | initial |
| a02.png | /jobs | dark | 1440x900 | default | Jobs | | initial |
| a03.png | /jobs | light | 1440x900 | detail | Jobs | table header | initial |

Source: `initial`, `requested (next round)`, or `requested (permanent)` once a
requested view shows an issue or is asked for again.

## Can't capture

- (State. Reason, e.g. cached data hides loading.)
