DIRECT           = 0;
REMOTE           = 1 << 0;
OBJECT           = 1 << 1;
ARRAY            = 1 << 2;
FUNCTION         = 1 << 3;
SYMBOL           = 1 << 4;
BIGINT           = 1 << 5;
BUFFER           = 1 << 6;
STRING           = 1 << 7;
ERROR            = (1 << 8) + ~REMOTE;

VIEW             = BUFFER | ARRAY;
REMOTE_OBJECT    = REMOTE | OBJECT;
REMOTE_ARRAY     = REMOTE | ARRAY;
REMOTE_FUNCTION  = REMOTE | FUNCTION;
