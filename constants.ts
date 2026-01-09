
import { Item, Enemy, Skill, PlayerClass, ItemMod, ClassDefinition } from './types';

export const DUNGEON_SIZE = 32;

export const MERCHANT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KICA8IS0tIEhvb2QgLS0+CiAgPHJlY3QgeD0iMTYiIHk9IjgiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCIgZmlsbD0iIzAwMTMwMCIvPgogIDxyZWN0IHg9IjIwIiB5PSI0IiB3aWR0aD0iMjQiIGhlaWdodD0iNTIiIGZpbGw9IiMwMDEzMDAiLz4KICA8IS0tIEZhY2UgQmFzZSAtLT4KICA8cmVjdCB4PSIyNCIgeT0iMTYiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwMzMwMCIvPgogIDxyZWN0IHg9IjI2IiB5PSIxNCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDMzMDAiLz4KICA8IS0tIENoZWVrYm9uZXMgJiBGb3JlaGVhZCAtLT4KICA8cmVjdCB4PSIyOCIgeT0iMTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDA0NDAwIi8+CiAgPHJlY3QgeD0iMjYiIHk9IjIwIiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgZmlsbD0iIzAwNDQwMCIvPgogIDwhLS0gRXllIFNvY2tldHMgLS0+CiAgPHJlY3QgeD0iMjciIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAxMTAwIi8+CiAgPHJlY3QgeD0iMzMiIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAxMTAwIi8+CiAgPCEtLSBHbG93aW5nIFB1cGlscyAtLT4KICA8cmVjdCB4PSIyOCIgeT0iMjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiMzM2ZmMzMiLz4KICA8cmVjdCB4PSIzNCIgeT0iMjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiMzM2ZmMzMiLz4KICA8cmVjdCB4PSIyOSIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYiLz4KICA8cmVjdCB4PSIzNSIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYiLz4KICA8IS0tIE5vc2UgLS0+CiAgPHJlY3QgeD0iMzEiIHk9IjI4IiB3aWR0aD0iMiIgaGVpZ2h0PSIzIiBmaWxsPSIjMDAyMjAwIi8+CiAgPCEtLSBNb3V0aCAvIENoaW4gLS0+CiAgPHJlY3QgeD0iMzAiIHk9IjM2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAxMTAwIi8+CiAgPHJlY3QgeD0iMjgiIHk9IjM4IiB3aWR0aD0iOCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAyMjAwIi8+CiAgPCEtLSBEaWdpdGFsIEJlYXJkIC0tPgogIDxyZWN0IHg9IjI2IiB5PSI0MCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDY2MDAiIG9wYWNpdHk9IjAuNiIvPgogIDxyZWN0IHg9IjI0IiB5PSI0NCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDY2MDAiIG9wYWNpdHk9IjAuMyIvPgogIDwhLS0gU2NhbiBMaW5lcyAtLT4KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9InVybCgjZ3JpZCkiIG9wYWNpdHk9IjAuMCIvPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMGZmMDAiIG9wYWNpdHk9IjAuMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KPC9zdmc+";

export const AVATAR_TRAVELER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIENsb2FrIC0tPjxyZWN0IHg9IjE6IiB5PSI4IiB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIGZpbGw9IiM1YzQwMzMiLz48cmVjdCB4PSIyMCIgeT0iNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjUyIiBmaWxsPSIjNWM0MDMzIi8+PCEtLSBEYXJrIEludGVyaW9yIC0tPjxyZWN0IHg9IjI0IiB5PSIxNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMmUyZTMzIi8+PCEtLSBFeWVzIChIaWRkZW4gaW4gc2hhZG93KSAtLT48cmVjdCB4PSIyNiIgeT0iMjAiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiNhYWZmYWEiIG9wYWNpdHk9IjAuNiIvPjxyZWN0IHg9IjM0IiB5PSIyMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iI2FhZmZhYSIgb3BhY2l0eT0iMC42Ii8+PCEtLSBTY2FyZiAtLT48cmVjdCB4PSIyMiIgeT0iMzIiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiBmaWxsPSIjOGI0NTEzIi8+PCEtLSBCcm9vY2ggLS0+PHJlY3QgeD0iMzAiIHk9IjM0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZkNTAwIi8+PC9zdmc+";

export const SPRITE_CHEST = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIFNoYWRvdyAtLT48cmVjdCB4PSI4IiB5PSI0OCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjgiIGZpbGw9IiMwMDAwMDAiIG9wYWNpdHk9IjAuNSIvPjwhLS0gQm9keSAtLT48cmVjdCB4PSIxMiIgeT0iMjgiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzViMzYxMiIvPjwhLS0gTGlkIC0tPjxyZWN0IHg9IjEwIiB5PSIxNiIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjEyIiBmaWxsPSIjN2M0YTE5Ii8+PCEtLSBHb2xkIEJhbmRzIC0tPjxyZWN0IHg9IjE0IiB5PSIyOCIgd2lkdGg9IjQiIGhlaWdodD0iMjQiIGZpbGw9IiNmZmQ3MDAiLz48cmVjdCB4PSI0NiIgeT0iMjgiIHdpZHRoPSI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZmZkNTAwIi8+PHJlY3QgeD0iMTIiIHk9IjE2IiB3aWR0aD0iNCIgaGVpZ2h0PSIxMiIgZmlsbD0iI2ZmZDcwMCIvPjxyZWN0IHg9IjQ4IiB5PSIxNiIgd2lkdGg9IjQiIGhlaWdodD0iMTIiIGZpbGw9IiNmZmQ3MDAiLz48IS0tIExvY2sgLS0+PHJlY3QgeD0iMjgiIHk9IjIyIiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjYzBjMGMwIi8+PHJlY3QgeD0iMzAiIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwMDAwIi8+PCEtLSBIaWdobGlnaHQgLS0+PHJlY3QgeD0iMTIiIHk9IjE2IiB3aWR0aD0iNDIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4yIi8+PC9zdmc+";

export const SPRITE_STAIRS = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIEJhY2tncm91bmQgLS0+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMWExYTFhIi8+PCEtLSBTdG9uZSBGcmFtZSAtLT48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNjQiIGhlaWdodD0iOCIgZmlsbD0iIzRlNGU0ZSIvPjxyZWN0IHg9IjAiIHk9IjU2IiB3aWR0aD0iNjQiIGhlaWdodD0iOCIgZmlsbD0iIzRlNGU0ZSIvPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI4IiBoZWlnaHQ9IjY0IiBmaWxsPSIjNGU0ZTRlIi8+PHJlY3QgeD0iNTYiIHk9IjAiIHdpZHRoPSI4IiBoZWlnaHQ9IjY0IiBmaWxsPSIjNGU0ZTRlIi8+PCEtLSBDcmFja3MgLS0+PHJlY3QgeD0iNCIgeT0iMTIiIHdpZHRoPSIyIiBoZWlnaHQ9IjYiIGZpbGw9IiMyYDJhMmEiLz48cmVjdCB4PSI1OCIgeT0iNDgiIHdpZHRoPSIyIiBoZWlnaHQ9IjQiIGZpbGw9IiMyYDJhMmEiLz48IS0tIERlc2NlbmRpbmcgU3RlcHMgLS0+PHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjM2MzYzNjIiLz48cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzJmMmYyZiIvPjxyZWN0IHg9IjI0IiB5PSIyNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMTExMTExIi8+PCEtLSBUaGUgVm9pZCAtLT48cmVjdCB4PSIyOCIgeT0iMjgiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMwMDAwMDAiLz48IS0tIE1vc3MvRGVjYXkgLS0+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDU1NTA1IiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSI1MCIgeT0iNTAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwNTU1MDUiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==";

export const AVATAR_BAT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIFdpbmdzIC0tPjxyZWN0IHg9IjQiIHk9IjIwIiB3aWR0aD0iNTYiIGhlaWdodD0iMiIgZmlsbD0iIzRhMTA1NCIvPjxyZWN0IHg9IjQiIHk9IjIyIiB3aWR0aD0iNTYiIGhlaWdodD0iNCIgZmlsbD0iIzJkMDgwMCIgLz48cmVjdCB4PSI4IiB5PSIyNiIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjYiIGZpbGw9IiMyZDA4MDAiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjEyIiB5PSIzMiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjYiIGZpbGw9IiMyZDA4MDAiIG9wYWNpdHk9IjAuNiIvPjwhLS0gQm9keSAtLT48cmVjdCB4PSIyNCIgeT0iMjQiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxOCIgZmlsbD0iIzEwMTAxMCIvPjwhLS0gRWFycyAtLT48cmVjdCB4PSIyNiIgeT0iMTgiIHdpZHRoPSI0IiBoZWlnaHQ9IjYiIGZpbGw9IiMxMDEwMTAiLz48cmVjdCB4PSIzNCIgeT0iMTgiIHdpZHRoPSI0IiBoZWlnaHQ9IjYiIGZpbGw9IiMxMDEwMTAiLz48IS0tIEV5ZXMgLS0+PHJlY3QgeD0iMjciIHk9IjI4IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiBmaWxsPSIjZmYwMDAwIi8+PHJlY3QgeD0iMzQiIHk9IjI4IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiBmaWxsPSIjZmYwMDAwIi8+PCEtLSBDeWJlciAtLT48cmVjdCB4PSIzMCIgeT0iMzIiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMGZmZmYiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjQiIHk9IjIwIiB3aWR0aD0iMiIgaGVpZ2h0PSIxMiIgZmlsbD0iIzg4MDA4OCIvPjxyZWN0IHg9IjU4IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iMTIiIGZpbGw9IiM4ODAwODgiLz48L3N2Zz4=";

export const AVATAR_SLIME = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIE1haW4gQmxvYiAtLT48cmVjdCB4PSIxNiIgeT0iMjgiIHdpZHRoPSIzMiIgaGVpZ2h0PSIyOCIgZmlsbD0iIzAwZmYwMCIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgZmlsbD0iIzAwZmYwMCIgb3BhY2l0eT0iMC42Ii8+PCEtLSBDb3JlIC0tPjxyZWN0IHg9IjI0IiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDA2NjAwIi8+PCEtLSBXZXQgU3BvdHMgLS0+PHJlY3QgeD0iMjIiIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSIzOCIgeT0iMzYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNSIvPjwhLS0gR2xpdGNoIENpcmN1aXRzIC0tPjxyZWN0IHg9IjI2IiB5PSIzNiIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjI2IiB5PSI0MCIgd2lkdGg9IjEiIGhlaWdodD0iNCIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjMyIiB5PSI0MCIgd2lkdGg9IjEiIGhlaWdodD0iNCIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjE4IiB5PSI0OCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjQyIiB5PSI0OCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzMzZmYzMyIvPjwvc3ZnPg==";

export const AVATAR_SKELETON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIFNrdWxsIC0tPjxyZWN0IHg9IjI0IiB5PSIxMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZGRkZGRkIi8+PHJlY3QgeD0iMjYiIHk9IjI4IiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgZmlsbD0iI2RkZGRkZCIvPjwhLS0gRXllcyAtLT48cmVjdCB4PSIyNiIgeT0iMTYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMxMTExMTEiLz48cmVjdCB4PSIzNCIgeT0iMTYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMxMTExMTEiLz48IS0tIFB1cGlscyAoR3JlZW4pIC0tPjxyZWN0IHg9IjI3IiB5PSIxNyIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iIzAwZmZhYSIvPjxyZWN0IHg9IjM1IiB5PSIxNyIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iIzAwZmZhYSIvPjwhLS0gUmlicyAtLT48cmVjdCB4PSIyOCIgeT0iMzQiIHdpZHRoPSI4IiBoZWlnaHQ9IjIiIGZpbGw9IiNkZGRkZGQiLz48cmVjdCB4PSIyOCIgeT0iMzgiIHdpZHRoPSI4IiBoZWlnaHQ9IjIiIGZpbGw9IiNkZGRkZGQiLz48cmVjdCB4PSIyOCIgeT0iNDIiIHdpZHRoPSI4IiBoZWlnaHQ9IjIiIGZpbGw9IiNkZGRkZGQiLz48cmVjdCB4PSIzMCIgeT0iMzIiIHdpZHRoPSI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMzMzMzMzIi8+PC9zdmc+";

const AVATAR_WARRIOR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNiIgeT0iMTIiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjE4IiB5PSIxMCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIyMCIgeT0iMjQiIHdpZHRoPSIyNCIgaGVpZ2h0PSI2IiBmaWxsPSIjMDAwMDAwIi8+PHJlY3QgeD0iMjIiIHk9IjI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMiIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjMwIiB5PSIzMiIgd2lkdGg9IjQiIGhlaWdodD0iMTQiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDA0NDAwIi8+PHJlY3QgeD0iMjQiIHk9IjQ4IiB3aWR0aD0iMTYiIGhlaWdodD0iNCIgZmlsbD0iIzAwNTUwMCIvPjwvc3ZnPg==";
const AVATAR_MAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNCIgeT0iOCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMDAyMjAwIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjgiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIyMiIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzM2ZmMzMiLz48cmVjdCB4PSIzOCIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzM2ZmMzMiLz48cmVjdCB4PSIyNCIgeT0iMjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiLz4KICA8cmVjdCB4PSI0MCIgeT0iMjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIzMCIgeT0iNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDU1MDAiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==";
const AVATAR_CLERIC = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwNDQwMCIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDAxMTAwIi8+PHJlY3QgeD0iMjQiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjNjZmZjY2Ii8+PHJlY3QgeD0iMzYiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjNjZmZjY2Ii8+PHJlY3QgeD0iMzAiIHk9IjgiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjI4IiB5PSIzNCIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iIzAwNjYwMCIvPjwvc3ZnPg==";
const AVATAR_BARBARIAN = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjE0IiB5PSI4IiB3aWR0aD0iMzYiIGhlaWdodD0iMTIiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIxMiIgeT0iMTIiIHdpZHRoPSI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDA1NTAwIi8+PHJlY3QgeD0iNDgiIHk9IjEyIiB3aWR0aD0iNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjIyIiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjM2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjIzIiB5PSIyNSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjM3IiB5PSIyNSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjIyIiB5PSIzMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjM4IiB5PSIzMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjMwIiB5PSIzOCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg==";
const AVATAR_ARCHER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KICA8IS0tIEJhY2tncm91bmQgLS0+CiAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMDAwMDAwIi8+CiAgPCEtLSBHcmVlbiBIb29kL0Nsb2FrIC0tPgogIDxyZWN0IHg9IjE2IiB5PSIxMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDA0NDAwIi8+CiAgPHJlY3QgeD0iMjAiIHk9IjgiIHdpZHRoPSIyNCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDA0NDAwIi8+CiAgPCEtLSBGYWNlIFNoYWRvdyAtLT4KICA8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwMjIwMCIvPgogIDwhLS0gRXllcyAoV2hpdGUgZm9yIGJsaW5raW5nKSAtLT4KICA8cmVjdCB4PSIyNCIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiLz4KICA8cmVjdCB4PSIzNCIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiLz4KICA8IS0tIEJvdyAtLT4KICA8cmVjdCB4PSIxMiIgeT0iMTYiIHdpZHRoPSI0IiBoZWlnaHQ9IjMyIiBmaWxsPSIjOEI0NTEzIi8+CiAgPHJlY3QgeD0iMTQiIHk9IjE0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPHJlY3QgeD0iMTQiIHk9IjQ2IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPCEtLSBTdHJpbmcgLS0+CiAgPHJlY3QgeD0iMTQiIHk9IjE4IiB3aWR0aD0iMSIgaGVpZ2h0PSIyOCIgZmlsbD0iI0FBQUFBQSIgb3BhY2l0eT0iMC41Ii8+Cjwvc3ZnPg==";
const AVATAR_ROGUE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIzNiIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjIwIiB5PSIyNCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjYiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIzNCIgeT0iMjQiIHdpZHRoPSIxMCIgaGVpZ2h0PSI2IiBmaWxsPSIjMDA1NTAwIi8+PHJlY3QgeD0iMjIiIHk9IjI1IiB3aWR0aD0iNiIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDAwIiAvPjxyZWN0IHg9IjM2IiB5PSIyNSIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iI2ZmMDAwMCIgLz48cmVjdCB4PSIxOCIgeT0iMzQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxNCIgZmlsbD0iIzAwMjIwMCIvPjxyZWN0IHg9IjMwIiB5PSIzNiIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwMTEwMCIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+";

export const MOD_POOL: ItemMod[] = [
  { stat: 'str', value: 2, name: 'of Might' },
  { stat: 'int', value: 2, name: 'of Mind' },
  { stat: 'dex', value: 2, name: 'of Speed' },
  { stat: 'vit', value: 2, name: 'of Vitality' },
  { stat: 'atk', value: 5, name: 'of Power' },
  { stat: 'def', value: 5, name: 'of Guard' },
  { stat: 'critChance', value: 5, name: 'of Precision' },
  { stat: 'hp', value: 20, name: 'of Health' },
  { stat: 'mp', value: 10, name: 'of Spirit' }
];

export const ITEMS: Item[] = [
    { id: 'sword_1', name: 'Cyberblade', type: 'weapon', value: 50, stat: 5, description: 'A standard edge infused with data.' },
    { id: 'staff_1', name: 'Null Rod', type: 'weapon', value: 50, magicStat: 5, description: 'Focuses chaotic energy.' },
    { id: 'bow_1', name: 'Pulse Bow', type: 'weapon', value: 50, stat: 4, description: 'Fires bolts of light.' },
    { id: 'dagger_1', name: 'Data Shiv', type: 'weapon', value: 45, stat: 3, description: 'Sharp and easily hidden.' },
    { id: 'mace_1', name: 'Bit Breaker', type: 'weapon', value: 55, stat: 6, description: 'Crushes firewalls.' },
    { id: 'helm_1', name: 'Visor', type: 'helm', value: 30, stat: 2, description: 'Basic optical enhancement.' },
    { id: 'chest_1', name: 'Vest', type: 'chest', value: 40, stat: 3, description: 'Light protection.' },
    { id: 'gloves_1', name: 'Grips', type: 'gloves', value: 25, stat: 1, description: 'Better handling.' },
    { id: 'boots_1', name: 'Runners', type: 'boots', value: 25, stat: 1, description: 'Standard footwear.' },
    { id: 'pot_hp_s', name: 'Nanite Patch', type: 'consumable', value: 10, stat: 50, description: 'Restores 50 HP.' },
    { id: 'pot_mp_s', name: 'Mana cell', type: 'consumable', value: 20, magicStat: 30, description: 'Restores 30 MP.' },
];

export const MATERIALS: Item[] = [
    { id: 'scrap', name: 'Scrap Metal', type: 'material', value: 5, description: 'Useless junk.' },
    { id: 'chip', name: 'Logic Chip', type: 'material', value: 15, description: 'Basic component.' },
    { id: 'core', name: 'Power Core', type: 'material', value: 50, description: 'Rare energy source.' },
];

export const ENEMIES: Enemy[] = [
    { id: 'bat', name: 'Byte Bat', hp: 30, maxHp: 30, mp: 0, maxMp: 0, level: 1, str: 5, int: 1, dex: 10, vit: 5, cha: 1, buffs: [], instanceId: '', xpValue: 10, goldValue: 5, color: '#ff0000', seed: 1, prompt: 'bat', avatar: AVATAR_BAT },
    { id: 'slime', name: 'Glitch Slime', hp: 40, maxHp: 40, mp: 0, maxMp: 0, level: 1, str: 4, int: 1, dex: 2, vit: 10, cha: 1, buffs: [], instanceId: '', xpValue: 15, goldValue: 8, color: '#00ff00', seed: 2, prompt: 'slime', avatar: AVATAR_SLIME },
    { id: 'skeleton', name: 'Null Frame', hp: 50, maxHp: 50, mp: 0, maxMp: 0, level: 2, str: 8, int: 1, dex: 5, vit: 8, cha: 1, buffs: [], instanceId: '', xpValue: 25, goldValue: 12, color: '#ffffff', seed: 3, prompt: 'skeleton', avatar: AVATAR_SKELETON },
];

const SKILLS: Skill[] = [
    { id: 'w_bash', name: 'Bash', desc: 'Heavy strike that delays enemy turn.', cost: 5, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.2 },
    { id: 'w_sw', name: 'Shield Wall', desc: 'Increase DEF for 3 turns.', cost: 8, type: 'buff', targetType: 'self', minLevel: 2 },
    { id: 'w_cleave', name: 'Cleave', desc: 'Hit all enemies.', cost: 15, type: 'attack', targetType: 'enemy', minLevel: 3, isAoe: true, basePower: 0.8 },
    
    { id: 'm_fire', name: 'Fireball', desc: 'Deal heavy fire damage.', cost: 8, type: 'special', targetType: 'enemy', minLevel: 1, basePower: 1.5 },
    { id: 'm_shld', name: 'Mana Shield', desc: 'Increase M.DEF.', cost: 10, type: 'buff', targetType: 'self', minLevel: 2 },
    { id: 'm_bolt', name: 'Thunderbolt', desc: 'Massive single target damage.', cost: 20, type: 'special', targetType: 'enemy', minLevel: 3, basePower: 2.2 },

    { id: 'c_heal', name: 'Heal', desc: 'Restore HP to an ally.', cost: 5, type: 'heal', targetType: 'ally', minLevel: 1, basePower: 2.0 },
    { id: 'c_bless', name: 'Bless', desc: 'Increase Ally STR.', cost: 10, type: 'buff', targetType: 'ally', minLevel: 2 },
    { id: 'c_rev', name: 'Revive', desc: 'Revive fallen ally.', cost: 25, type: 'heal', targetType: 'ally', minLevel: 3, revive: true },

    { id: 'b_shout', name: 'War Cry', desc: 'Buff Party ATK.', cost: 10, type: 'buff', targetType: 'ally', minLevel: 1 },
    { id: 'b_blood', name: 'Bloodlust', desc: 'Attack and heal self.', cost: 12, type: 'attack', targetType: 'enemy', minLevel: 2, basePower: 1.2 },
    { id: 'b_endure', name: 'Endure', desc: 'Buff VIT and Heal.', cost: 15, type: 'buff', targetType: 'self', minLevel: 3 },

    { id: 'a_shot', name: 'Power Shot', desc: 'Strong ranged attack.', cost: 6, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.4 },
    { id: 'a_eye', name: 'Eagle Eye', desc: 'Buff Crit Chance.', cost: 10, type: 'buff', targetType: 'self', minLevel: 2 },
    { id: 'a_fire', name: 'Fire Arrow', desc: 'Burn enemy (DoT).', cost: 12, type: 'attack', targetType: 'enemy', minLevel: 3, basePower: 1.2 },

    { id: 'r_stab', name: 'Backstab', desc: 'High crit chance attack.', cost: 6, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.3 },
    { id: 'r_pois', name: 'Poison Edge', desc: 'Poison enemy.', cost: 10, type: 'attack', targetType: 'enemy', minLevel: 2, basePower: 1.0 },
    { id: 'r_gold', name: 'Mug', desc: 'Damage and steal gold/item.', cost: 12, type: 'attack', targetType: 'enemy', minLevel: 3, basePower: 1.1 },
];

export const CLASSES: ClassDefinition[] = [
    { type: 'WARRIOR', avatar: AVATAR_WARRIOR, description: 'Melee fighter with high defense.', hp: 120, mp: 20, str: 10, int: 2, dex: 5, vit: 10, cha: 3, skillPool: SKILLS, starterSkillIds: ['w_bash'] },
    { type: 'MAGE', avatar: AVATAR_MAGE, description: 'Spellcaster with high damage.', hp: 80, mp: 60, str: 2, int: 12, dex: 6, vit: 4, cha: 5, skillPool: SKILLS, starterSkillIds: ['m_fire'] },
    { type: 'CLERIC', avatar: AVATAR_CLERIC, description: 'Healer and support.', hp: 90, mp: 50, str: 5, int: 8, dex: 4, vit: 6, cha: 8, skillPool: SKILLS, starterSkillIds: ['c_heal'] },
    { type: 'BARBARIAN', avatar: AVATAR_BARBARIAN, description: 'High HP brawler.', hp: 140, mp: 15, str: 12, int: 1, dex: 4, vit: 12, cha: 2, skillPool: SKILLS, starterSkillIds: ['b_shout'] },
    { type: 'ARCHER', avatar: AVATAR_ARCHER, description: 'Ranged precision damage.', hp: 90, mp: 30, str: 6, int: 4, dex: 12, vit: 5, cha: 4, skillPool: SKILLS, starterSkillIds: ['a_shot'] },
    { type: 'ROGUE', avatar: AVATAR_ROGUE, description: 'Fast attacker with utility.', hp: 100, mp: 30, str: 8, int: 4, dex: 12, vit: 5, cha: 4, skillPool: SKILLS, starterSkillIds: ['r_stab'] },
];

export const generateDungeon = (): number[][][] => {
    const floors = [];
    const size = DUNGEON_SIZE;

    for (let f = 0; f < 5; f++) {
        // 1. Initialize map with Walls (1)
        const map = Array(size).fill(0).map(() => Array(size).fill(1));
        
        // --- GUARANTEED CONNECTED CHAOS GROW ALGORITHM ---
        
        // Start is always safe
        map[1][1] = 0;
        
        // List of miners - all start at the safe zone (1,1)
        // This ensures every path they carve is connected to the start.
        const miners = [
            { x: 1, y: 1 }, 
            { x: 1, y: 1 },
            { x: 1, y: 1 } 
        ];

        let floorCount = 1;
        const targetFloorCount = Math.floor((size * size) * 0.45); // 45% fill

        while (floorCount < targetFloorCount && miners.length > 0) {
            // Process each miner
            for (let i = miners.length - 1; i >= 0; i--) {
                const miner = miners[i];
                
                // Pick a random direction
                const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
                const dir = dirs[Math.floor(Math.random() * dirs.length)];
                
                const nx = miner.x + dir[0];
                const ny = miner.y + dir[1];

                // Bounds check (Keep 1-tile border)
                if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1) {
                    // Move
                    miner.x = nx;
                    miner.y = ny;

                    // If it's a wall, carve it
                    if (map[ny][nx] === 1) {
                        map[ny][nx] = 0;
                        floorCount++;
                        
                        // Small chance to spawn a new miner at this location to create branching
                        if (Math.random() < 0.05 && miners.length < 8) {
                            miners.push({ x: nx, y: ny });
                        }
                    } 
                } else {
                    // Hit world edge - turn around or die
                    // Small chance to die if we have other miners, keeps it messy
                    if (miners.length > 1 && Math.random() < 0.2) {
                        miners.splice(i, 1);
                    }
                }
            }
            
            // Safety: If all miners died but map is too small, respawn one at a random existing floor tile
            if (miners.length === 0 && floorCount < targetFloorCount) {
                const existingFloors = [];
                for(let y=0; y<size; y++) {
                    for(let x=0; x<size; x++) {
                        if(map[y][x] === 0) existingFloors.push({x, y});
                    }
                }
                const randomSpot = existingFloors[Math.floor(Math.random() * existingFloors.length)];
                miners.push({ x: randomSpot.x, y: randomSpot.y });
            }
        }

        // --- FEATURE PLACEMENT & BFS VALIDATION ---

        // 1. Identify all reachable floor tiles from (1,1) via BFS to calculate distances
        // This validates connectivity AND helps place stairs far away.
        const distances: Record<string, number> = {};
        const queue: {x: number, y: number, dist: number}[] = [{x: 1, y: 1, dist: 0}];
        distances[`1,1`] = 0;
        
        let maxDist = 0;
        let maxDistTile = {x: 1, y: 1};
        const allReachableTiles: {x: number, y: number}[] = [];

        while(queue.length > 0) {
            const current = queue.shift()!;
            allReachableTiles.push(current);

            if (current.dist > maxDist) {
                maxDist = current.dist;
                maxDistTile = {x: current.x, y: current.y};
            }

            const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            for(const d of dirs) {
                const nx = current.x + d[0];
                const ny = current.y + d[1];
                const key = `${nx},${ny}`;
                
                if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && map[ny][nx] === 0 && distances[key] === undefined) {
                    distances[key] = current.dist + 1;
                    queue.push({x: nx, y: ny, dist: current.dist + 1});
                }
            }
        }

        // 2. Place Stairs at the furthest point found
        map[maxDistTile.y][maxDistTile.x] = 3;

        // 3. Place Chests/Events on other reachable tiles
        // Filter out start (1,1) and stairs (maxDistTile)
        const validSpots = allReachableTiles.filter(t => 
            !(t.x === 1 && t.y === 1) && 
            !(t.x === maxDistTile.x && t.y === maxDistTile.y)
        );

        // Helper to pick random spot
        const pickSpot = () => {
            if (validSpots.length === 0) return null;
            const idx = Math.floor(Math.random() * validSpots.length);
            return validSpots.splice(idx, 1)[0];
        };

        // Chests
        for (let i = 0; i < 4 + f; i++) {
            const spot = pickSpot();
            if (spot) map[spot.y][spot.x] = 4;
        }

        // Merchant (Floor 0)
        if (f === 0) {
             const spot = pickSpot();
             if (spot) map[spot.y][spot.x] = 5;
        }

        // Traveler (Floor 1)
        if (f === 1) {
             const spot = pickSpot();
             if (spot) map[spot.y][spot.x] = 6;
        }

        // Secret Walls (Requires logic to check walls adjacent to reachable floors)
        if (f > 0) {
             let secrets = 0;
             // Try to find a wall adjacent to a valid floor spot that leads to... nowhere? 
             // Or carve a new niche.
             for(let i=0; i<200 && secrets < 3; i++) {
                 const base = allReachableTiles[Math.floor(Math.random() * allReachableTiles.length)];
                 const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
                 const dir = dirs[Math.floor(Math.random() * dirs.length)];
                 
                 const wx = base.x + dir[0]; // Wall candidate
                 const wy = base.y + dir[1];
                 const ox = wx + dir[0]; // Hidden room candidate
                 const oy = wy + dir[1];
                 
                 // Check if Wall candidate is actually a wall
                 if (wx > 0 && wx < size-1 && wy > 0 && wy < size-1 && map[wy][wx] === 1) {
                     // Check if hidden room candidate is solid rock (unreachable)
                     if (ox > 0 && ox < size-1 && oy > 0 && oy < size-1 && map[oy][ox] === 1) {
                         // Carve secret
                         map[wy][wx] = 9; // Secret Door
                         map[oy][ox] = 4; // Hidden Chest in new room
                         secrets++;
                     }
                 }
             }
        }

        floors.push(map);
    }
    return floors;
};
