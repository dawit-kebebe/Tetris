- Shapes are a predefined Objects that have bottom and top.

### Todo:
- We need an engine to take in the shape:
    - Check the position 
```
        Compute whether it landed successfully or not
                           |
                      ____________
                     /              \
                    /                \
                Eliminate A        Settle the shape in place
                row if row is          /
                complete              /  
                   \                 /
                    -----------------
                            |
                    Trigger the next shape

```


- Square Level Collition detection achieved.
- End of line detection successful.
### Bug:
- Navigation along X-axis has a bug. Shapes (squares) go out of bound during repeated navigation event.
- The navigation listener is not synchronized with the rendering of the shapes.