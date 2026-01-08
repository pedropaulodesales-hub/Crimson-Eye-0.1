
import { Item, Enemy, Skill, PlayerClass, ItemMod, ClassDefinition } from './types';

export const DUNGEON_SIZE = 20;

/**
 * MERCHANT_AVATAR: A high-detail pixel-art cyber face.
 */
export const MERCHANT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KICA8IS0tIEhvb2QgLS0+CiAgPHJlY3QgeD0iMTYiIHk9IjgiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCIgZmlsbD0iIzAwMTMwMCIvPgogIDxyZWN0IHg9IjIwIiB5PSI0IiB3aWR0aD0iMjQiIGhlaWdodD0iNTIiIGZpbGw9IiMwMDEzMDAiLz4KICA8IS0tIEZhY2UgQmFzZSAtLT4KICA8cmVjdCB4PSIyNCIgeT0iMTYiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwMzMwMCIvPgogIDxyZWN0IHg9IjI2IiB5PSIxNCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDMzMDAiLz4KICA8IS0tIENoZWVrYm9uZXMgJiBGb3JlaGVhZCAtLT4KICA8cmVjdCB4PSIyOCIgeT0iMTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDA0NDAwIi8+CiAgPHJlY3QgeD0iMjYiIHk9IjIwIiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgZmlsbD0iIzAwNDQwMCIvPgogIDwhLS0gRXllIFNvY2tldHMgLS0+CiAgPHJlY3QgeD0iMjciIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAxMTAwIi8+CiAgPHJlY3QgeD0iMzMiIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAxMTAwIi8+CiAgPCEtLSBHbG93aW5nIFB1cGlscyAtLT4KICA8cmVjdCB4PSIyOCIgeT0iMjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiMzM2ZmMzMiLz4KICA8cmVjdCB4PSIzNCIgeT0iMjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiMzM2ZmMzMiLz4KICA8cmVjdCB4PSIyOSIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYiLz4KICA8cmVjdCB4PSIzNSIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYiLz4KICA8IS0tIE5vc2UgLS0+CiAgPHJlY3QgeD0iMzEiIHk9IjI4IiB3aWR0aD0iMiIgaGVpZ2h0PSIzIiBmaWxsPSIjMDAyMjAwIi8+CiAgPCEtLSBNb3V0aCAvIENoaW4gLS0+CiAgPHJlY3QgeD0iMzAiIHk9IjM2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAxMTAwIi8+CiAgPHJlY3QgeD0iMjgiIHk9IjM4IiB3aWR0aD0iOCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAyMjAwIi8+CiAgPCEtLSBEaWdpdGFsIEJlYXJkIC0tPgogIDxyZWN0IHg9IjI2IiB5PSI0MCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDY2MDAiIG9wYWNpdHk9IjAuNiIvPgogIDxyZWN0IHg9IjI0IiB5PSI0NCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDY2MDAiIG9wYWNpdHk9IjAuMyIvPgogIDwhLS0gU2NhbiBMaW5lcyAtLT4KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9InVybCgjZ3JpZCkiIG9wYWNpdHk9IjAuMCIvPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMGZmMDAiIG9wYWNpdHk9IjAuMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KPC9zdmc+";

// TRAVELER AVATAR (Brown/Rogue-ish)
export const AVATAR_TRAVELER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIENsb2FrIC0tPjxyZWN0IHg9IjE2IiB5PSI4IiB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIGZpbGw9IiM1YzQwMzMiLz48cmVjdCB4PSIyMCIgeT0iNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjUyIiBmaWxsPSIjNWM0MDMzIi8+PCEtLSBEYXJrIEludGVyaW9yIC0tPjxyZWN0IHg9IjI0IiB5PSIxNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMmUyZTMzIi8+PCEtLSBFeWVzIChIaWRkZW4gaW4gc2hhZG93KSAtLT48cmVjdCB4PSIyNiIgeT0iMjAiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiNhYWZmYWEiIG9wYWNpdHk9IjAuNiIvPjxyZWN0IHg9IjM0IiB5PSIyMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iI2FhZmZhYSIgb3BhY2l0eT0iMC42Ii8+PCEtLSBTY2FyZiAtLT48cmVjdCB4PSIyMiIgeT0iMzIiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiBmaWxsPSIjOGI0NTEzIi8+PCEtLSBCcm9vY2ggLS0+PHJlY3QgeD0iMzAiIHk9IjM0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZkNTAwIi8+PC9zdmc+";

// ENEMY AVATARS
export const AVATAR_BAT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIFdpbmdzIC0tPjxyZWN0IHg9IjQiIHk9IjIwIiB3aWR0aD0iNTYiIGhlaWdodD0iMiIgZmlsbD0iIzRhMTA1NCIvPjxyZWN0IHg9IjQiIHk9IjIyIiB3aWR0aD0iNTYiIGhlaWdodD0iNCIgZmlsbD0iIzJkMDgwMCIgLz48cmVjdCB4PSI4IiB5PSIyNiIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjYiIGZpbGw9IiMyZDA4MDAiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjEyIiB5PSIzMiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjYiIGZpbGw9IiMyZDA4MDAiIG9wYWNpdHk9IjAuNiIvPjwhLS0gQm9keSAtLT48cmVjdCB4PSIyNCIgeT0iMjQiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxOCIgZmlsbD0iIzEwMTAxMCIvPjwhLS0gRWFycyAtLT48cmVjdCB4PSIyNiIgeT0iMTgiIHdpZHRoPSI0IiBoZWlnaHQ9IjYiIGZpbGw9IiMxMDEwMTAiLz48cmVjdCB4PSIzNCIgeT0iMTgiIHdpZHRoPSI0IiBoZWlnaHQ9IjYiIGZpbGw9IiMxMDEwMTAiLz48IS0tIEV5ZXMgLS0+PHJlY3QgeD0iMjciIHk9IjI4IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiBmaWxsPSIjZmYwMDAwIi8+PHJlY3QgeD0iMzQiIHk9IjI4IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiBmaWxsPSIjZmYwMDAwIi8+PCEtLSBDeWJlciAtLT48cmVjdCB4PSIzMCIgeT0iMzIiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMGZmZmYiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjQiIHk9IjIwIiB3aWR0aD0iMiIgaGVpZ2h0PSIxMiIgZmlsbD0iIzg4MDA4OCIvPjxyZWN0IHg9IjU4IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iMTIiIGZpbGw9IiM4ODAwODgiLz48L3N2Zz4=";

export const AVATAR_SLIME = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIE1haW4gQmxvYiAtLT48cmVjdCB4PSIxNiIgeT0iMjgiIHdpZHRoPSIzMiIgaGVpZ2h0PSIyOCIgZmlsbD0iIzAwZmYwMCIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgZmlsbD0iIzAwZmYwMCIgb3BhY2l0eT0iMC42Ii8+PCEtLSBDb3JlIC0tPjxyZWN0IHg9IjI0IiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDA2NjAwIi8+PCEtLSBXZXQgU3BvdHMgLS0+PHJlY3QgeD0iMjIiIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSIzOCIgeT0iMzYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNSIvPjwhLS0gR2xpdGNoIENpcmN1aXRzIC0tPjxyZWN0IHg9IjI2IiB5PSIzNiIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjI2IiB5PSI0MCIgd2lkdGg9IjEiIGhlaWdodD0iNCIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjMyIiB5PSI0MCIgd2lkdGg9IjEiIGhlaWdodD0iNCIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjE4IiB5PSI0OCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjQyIiB5PSI0OCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzMzZmYzMyIvPjwvc3ZnPg==";

export const AVATAR_SKELETON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIFNrdWxsIC0tPjxyZWN0IHg9IjI0IiB5PSIxMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZGRkZGRkIi8+PHJlY3QgeD0iMjYiIHk9IjI4IiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgZmlsbD0iI2RkZGRkZCIvPjwhLS0gRXllcyAtLT48cmVjdCB4PSIyNiIgeT0iMTYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMxMTExMTEiLz48cmVjdCB4PSIzNCIgeT0iMTYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMxMTExMTEiLz48IS0tIFB1cGlscyAoR3JlZW4pIC0tPjxyZWN0IHg9IjI3IiB5PSIxNyIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iIzAwZmZhYSIvPjxyZWN0IHg9IjM1IiB5PSIxNyIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iIzAwZmZhYSIvPjwhLS0gUmlicyAtLT48cmVjdCB4PSIyOCIgeT0iMzQiIHdpZHRoPSI4IiBoZWlnaHQ9IjIiIGZpbGw9IiNkZGRkZGQiLz48cmVjdCB4PSIyOCIgeT0iMzgiIHdpZHRoPSI4IiBoZWlnaHQ9IjIiIGZpbGw9IiNkZGRkZGQiLz48cmVjdCB4PSIyOCIgeT0iNDIiIHdpZHRoPSI4IiBoZWlnaHQ9IjIiIGZpbGw9IiNkZGRkZGQiLz48cmVjdCB4PSIzMCIgeT0iMzIiIHdpZHRoPSI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMzMzMzMzIi8+PC9zdmc+";

// AVATAR DEFINITIONS
const AVATAR_WARRIOR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNiIgeT0iMTIiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjE4IiB5PSIxMCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIyMCIgeT0iMjQiIHdpZHRoPSIyNCIgaGVpZ2h0PSI2IiBmaWxsPSIjMDAwMDAwIi8+PHJlY3QgeD0iMjIiIHk9IjI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMiIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjMwIiB5PSIzMiIgd2lkdGg9IjQiIGhlaWdodD0iMTQiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDA0NDAwIi8+PHJlY3QgeD0iMjQiIHk9IjQ4IiB3aWR0aD0iMTYiIGhlaWdodD0iNCIgZmlsbD0iIzAwNTUwMCIvPjwvc3ZnPg==";
const AVATAR_MAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNCIgeT0iOCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMDAyMjAwIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjgiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIyMiIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzM2ZmMzMiLz48cmVjdCB4PSIzOCIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzM2ZmMzMiLz48cmVjdCB4PSIyNCIgeT0iMjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSI0MCIgeT0iMjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIzMCIgeT0iNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDU1MDAiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==";
const AVATAR_CLERIC = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwNDQwMCIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDAxMTAwIi8+PHJlY3QgeD0iMjQiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjNjZmZjY2Ii8+PHJlY3QgeD0iMzYiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjNjZmZjY2Ii8+PHJlY3QgeD0iMzAiIHk9IjgiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjI4IiB5PSIzNCIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iIzAwNjYwMCIvPjwvc3ZnPg==";
const AVATAR_BARBARIAN = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjE0IiB5PSI4IiB3aWR0aD0iMzYiIGhlaWdodD0iMTIiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIxMiIgeT0iMTIiIHdpZHRoPSI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDA1NTAwIi8+PHJlY3QgeD0iNDgiIHk9IjEyIiB3aWR0aD0iNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjIyIiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjM2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjIzIiB5PSIyNSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjM3IiB5PSIyNSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjIyIiB5PSIzMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjM4IiB5PSIzMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjMwIiB5PSIzOCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg==";
const AVATAR_ARCHER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDA1NTAwIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjgiIGZpbGw9IiMwMDIyMDAiLz48cmVjdCB4PSIyNCIgeT0iMjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzM2ZmMzMiLz48cmVjdCB4PSIzMCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwNDQwMCIvPjxyZWN0IHg9IjMyIiB5PSIyNCIgd2lkdGg9IjgiIGhlaWdodD0iNiIgZmlsbD0iIzAwZmYwMCIgb3BhY2l0eT0iMC41Ii8+PHJlY3QgeD0iMzUiIHk9IjI2IiB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmZmZmIi8+PHJlY3QgeD0iMzAiIHk9IjQwIiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAwMDAwIi8+PC9zdmc+";
const AVATAR_ROGUE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIzNiIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjIwIiB5PSIyNCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjYiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIzNCIgeT0iMjQiIHdpZHRoPSIxMCIgaGVpZ2h0PSI2IiBmaWxsPSIjMDA1NTAwIi8+PHJlY3QgeD0iMjIiIHk9IjI1IiB3aWR0aD0iNiIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDAwIiAvPjxyZWN0IHg9IjM2IiB5PSIyNSIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iI2ZmMDAwMCIgLz48cmVjdCB4PSIxOCIgeT0iMzQiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxNCIgZmlsbD0iIzAwMjIwMCIvPjxyZWN0IHg9IjMwIiB5PSIzNiIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwMTEwMCIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+";

export const MOD_POOL: ItemMod[] = [
  { name: 'of Power', stat: 'str', value: 2 },
  { name: 'of Mind', stat: 'int', value: 2 },
  { name: 'of Speed', stat: 'dex', value: 2 },
  { name: 'of Vitality', stat: 'vit', value: 2 },
  { name: 'of Sharpness', stat: 'atk', value: 5 },
  { name: 'of Protection', stat: 'def', value: 5 },
];

export const ITEMS: Item[] = [
  { id: 'pot_hp_s', name: 'Small Potion', type: 'consumable', value: 10, stat: 20, description: 'Restores 20 HP' },
  { id: 'pot_hp_m', name: 'Medium Potion', type: 'consumable', value: 30, stat: 50, description: 'Restores 50 HP' },
  { id: 'sword_iron', name: 'Iron Sword', type: 'weapon', value: 50, stat: 5, description: 'Standard infantry sword.' },
  { id: 'staff_wood', name: 'Wooden Staff', type: 'weapon', value: 40, magicStat: 5, stat: 1, description: 'A stick with faint magic.' },
  { id: 'dagger_iron', name: 'Iron Dagger', type: 'weapon', value: 45, stat: 3, description: 'Quick and deadly.' },
  { id: 'axe_iron', name: 'Iron Axe', type: 'weapon', value: 55, stat: 7, description: 'Heavy hitter.' },
  { id: 'mace_iron', name: 'Iron Mace', type: 'weapon', value: 50, stat: 6, description: 'Crushes bones.' },
  { id: 'bow_wood', name: 'Wooden Bow', type: 'weapon', value: 50, stat: 4, description: 'Ranged attack.' },
  { id: 'helm_leather', name: 'Leather Cap', type: 'helm', value: 20, stat: 2, description: 'Basic head protection.' },
  { id: 'chest_leather', name: 'Leather Armor', type: 'chest', value: 30, stat: 4, description: 'Light armor.' },
  { id: 'gloves_leather', name: 'Leather Gloves', type: 'gloves', value: 15, stat: 1, description: 'Hand protection.' },
  { id: 'boots_leather', name: 'Leather Boots', type: 'boots', value: 15, stat: 1, description: 'Footwear.' },
  { id: 'ring_iron', name: 'Iron Ring', type: 'accessory', value: 25, stat: 1, description: 'Simple jewelry.' },
];

export const MATERIALS: Item[] = [
  { id: 'mat_slime', name: 'Slime Gel', type: 'material', value: 5, description: 'Sticky residue.' },
  { id: 'mat_bone', name: 'Bone Shard', type: 'material', value: 8, description: 'Fragment of a skeleton.' },
  { id: 'mat_cloth', name: 'Torn Cloth', type: 'material', value: 5, description: 'Scrap of fabric.' },
];

export const ENEMIES: Enemy[] = [
    {
        id: 'bat', instanceId: '', name: 'Cyber Bat', level: 1,
        hp: 20, maxHp: 20, mp: 0, maxMp: 0,
        str: 5, int: 1, dex: 10, vit: 2, cha: 1,
        xpValue: 10, goldValue: 5,
        color: '#ff0000', seed: 1, prompt: 'bat',
        buffs: [],
        avatar: AVATAR_BAT
    },
    {
        id: 'slime', instanceId: '', name: 'Glitch Slime', level: 1,
        hp: 30, maxHp: 30, mp: 0, maxMp: 0,
        str: 4, int: 1, dex: 2, vit: 5, cha: 1,
        xpValue: 15, goldValue: 8,
        color: '#00ff00', seed: 2, prompt: 'slime',
        buffs: [],
        avatar: AVATAR_SLIME
    },
    {
        id: 'bat_l2', instanceId: '', name: 'Vampire Bat', level: 2,
        hp: 35, maxHp: 35, mp: 0, maxMp: 0,
        str: 8, int: 3, dex: 15, vit: 4, cha: 1,
        xpValue: 25, goldValue: 12,
        color: '#aa0000', seed: 3, prompt: 'bat',
        buffs: [],
        avatar: AVATAR_BAT
    },
    {
        id: 'skeleton', instanceId: '', name: 'Data Skeleton', level: 3,
        hp: 60, maxHp: 60, mp: 0, maxMp: 0,
        str: 12, int: 1, dex: 8, vit: 10, cha: 1,
        xpValue: 40, goldValue: 20,
        color: '#cccccc', seed: 4, prompt: 'skeleton',
        buffs: [],
        avatar: AVATAR_SKELETON
    }
];

const WARRIOR_SKILLS: Skill[] = [
    // Active
    { id: 'w_bash', name: 'Shield Bash', desc: 'Stuns enemy, delaying turn.', cost: 8, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.2 },
    { id: 'w_cleave', name: 'Cleave', desc: 'Hit all enemies.', cost: 12, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 1, basePower: 0.8 },
    { id: 'w_taunt', name: 'Taunt', desc: 'Force enemy to attack you.', cost: 5, type: 'special', targetType: 'enemy', minLevel: 4 },
    { id: 'w_rend', name: 'Rend', desc: 'Bleed damage over time.', cost: 10, type: 'attack', targetType: 'enemy', minLevel: 8, basePower: 1.1 },
    { id: 'w_sw', name: 'Shield Wall', desc: 'Greatly Buff Defense.', cost: 15, type: 'buff', targetType: 'self', minLevel: 12 },
    { id: 'w_charge', name: 'Charge', desc: 'High speed attack.', cost: 12, type: 'attack', targetType: 'enemy', minLevel: 16, basePower: 1.4 },
    { id: 'w_warcry', name: 'War Cry', desc: 'Buff Party Attack.', cost: 20, type: 'buff', targetType: 'ally', isAoe: true, minLevel: 20 },
    { id: 'w_pummel', name: 'Pummel', desc: 'Multi-hit strike.', cost: 18, type: 'attack', targetType: 'enemy', minLevel: 24, basePower: 1.6 },
    { id: 'w_intimidate', name: 'Intimidate', desc: 'Lower enemy attack.', cost: 15, type: 'special', targetType: 'enemy', isAoe: true, minLevel: 28 },
    { id: 'w_execute', name: 'Execute', desc: 'High dmg to low HP.', cost: 25, type: 'attack', targetType: 'enemy', minLevel: 35, basePower: 2.5 },
    { id: 'w_shockwave', name: 'Shockwave', desc: 'Stun all enemies.', cost: 30, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 40, basePower: 1.2 },
    { id: 'w_laststand', name: 'Last Stand', desc: 'Survive fatal hit.', cost: 40, type: 'buff', targetType: 'self', minLevel: 45 },
    { id: 'w_colossus', name: 'Colossus', desc: 'Huge HP/DEF boost.', cost: 50, type: 'buff', targetType: 'self', minLevel: 50 },
    { id: 'w_blstorm', name: 'Bladestorm', desc: 'Massive AOE dmg.', cost: 45, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 55, basePower: 2.0 },
    { id: 'w_godslayer', name: 'Godslayer', desc: 'Ultimate single strike.', cost: 60, type: 'attack', targetType: 'enemy', minLevel: 60, basePower: 4.0 },
    // Passive
    { id: 'w_p_iron', name: 'Iron Skin', desc: 'Passive DEF boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 2, passiveStat: 'def', passiveVal: 5 },
    { id: 'w_p_fit', name: 'Fitness', desc: 'Passive HP boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 6, passiveStat: 'maxHp', passiveVal: 20 },
    { id: 'w_p_sword', name: 'Blade Mastery', desc: 'Passive ATK boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 10, passiveStat: 'atk', passiveVal: 5 },
    { id: 'w_p_parry', name: 'Parry', desc: 'Passive EVA boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 18, passiveStat: 'eva', passiveVal: 5 },
    { id: 'w_p_grit', name: 'Grit', desc: 'Passive VIT boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 26, passiveStat: 'vit', passiveVal: 5 },
    { id: 'w_p_rage', name: 'Vengeance', desc: 'Passive STR boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 34, passiveStat: 'str', passiveVal: 5 },
    { id: 'w_p_jugger', name: 'Juggernaut', desc: 'Large DEF boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 42, passiveStat: 'def', passiveVal: 15 },
    { id: 'w_p_legend', name: 'Warlord', desc: 'All Stats Boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 55, passiveStat: 'str', passiveVal: 10 }
];

const MAGE_SKILLS: Skill[] = [
    // Active
    { id: 'm_fire', name: 'Fireball', desc: 'Heavy magic damage.', cost: 10, type: 'special', targetType: 'enemy', minLevel: 1, basePower: 1.5 },
    { id: 'm_surge', name: 'Mana Surge', desc: 'Recover MP.', cost: 0, type: 'special', targetType: 'self', minLevel: 1 },
    { id: 'm_ice', name: 'Ice Bolt', desc: 'Dmg + Slow enemy.', cost: 12, type: 'special', targetType: 'enemy', minLevel: 4, basePower: 1.3 },
    { id: 'm_shld', name: 'Mana Shield', desc: 'Buff Magic Def.', cost: 15, type: 'buff', targetType: 'self', minLevel: 8 },
    { id: 'm_thund', name: 'Thunder', desc: 'High variance dmg.', cost: 18, type: 'special', targetType: 'enemy', minLevel: 12, basePower: 1.8 },
    { id: 'm_drain', name: 'Drain Life', desc: 'Steal HP from foe.', cost: 20, type: 'special', targetType: 'enemy', minLevel: 16, basePower: 1.2 },
    { id: 'm_med', name: 'Meditate', desc: 'Buff Magic Atk.', cost: 20, type: 'buff', targetType: 'self', minLevel: 20 },
    { id: 'm_quake', name: 'Earthquake', desc: 'AOE Earth dmg.', cost: 30, type: 'special', targetType: 'enemy', isAoe: true, minLevel: 24, basePower: 1.4 },
    { id: 'm_silence', name: 'Silence', desc: 'Prevent enemy magic.', cost: 25, type: 'special', targetType: 'enemy', minLevel: 28 },
    { id: 'm_meteor', name: 'Meteor', desc: 'Massive single dmg.', cost: 40, type: 'special', targetType: 'enemy', minLevel: 35, basePower: 3.0 },
    { id: 'm_blizz', name: 'Blizzard', desc: 'AOE Ice dmg.', cost: 45, type: 'special', targetType: 'enemy', isAoe: true, minLevel: 40, basePower: 1.8 },
    { id: 'm_flare', name: 'Solar Flare', desc: 'Blind enemies.', cost: 35, type: 'special', targetType: 'enemy', isAoe: true, minLevel: 45 },
    { id: 'm_warp', name: 'Time Warp', desc: 'Instant turn reset.', cost: 60, type: 'buff', targetType: 'self', minLevel: 50 },
    { id: 'm_apoc', name: 'Apocalypse', desc: 'Ultimate AOE.', cost: 80, type: 'special', targetType: 'enemy', isAoe: true, minLevel: 55, basePower: 2.5 },
    { id: 'm_void', name: 'Void', desc: 'Delete enemy (Boss res).', cost: 99, type: 'special', targetType: 'enemy', minLevel: 60, basePower: 5.0 },
    // Passive
    { id: 'm_p_mind', name: 'Arcane Mind', desc: 'Passive INT boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 2, passiveStat: 'int', passiveVal: 5 },
    { id: 'm_p_flow', name: 'Mana Flow', desc: 'Passive MP boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 6, passiveStat: 'maxMp', passiveVal: 30 },
    { id: 'm_p_focus', name: 'Focus', desc: 'Passive MAG boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 10, passiveStat: 'mAtk', passiveVal: 5 },
    { id: 'm_p_ward', name: 'Ward', desc: 'Passive RES boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 18, passiveStat: 'mDef', passiveVal: 10 },
    { id: 'm_p_clear', name: 'Clarity', desc: 'Passive INT boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 26, passiveStat: 'int', passiveVal: 10 },
    { id: 'm_p_ench', name: 'Enchant', desc: 'Passive ACC boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 34, passiveStat: 'acc', passiveVal: 10 },
    { id: 'm_p_soul', name: 'Soul Power', desc: 'Large MP boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 42, passiveStat: 'maxMp', passiveVal: 100 },
    { id: 'm_p_arch', name: 'Archmage', desc: 'Large MAG boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 55, passiveStat: 'mAtk', passiveVal: 20 }
];

const ROGUE_SKILLS: Skill[] = [
    // Active
    { id: 'r_dage', name: 'Backstab', desc: 'High crit chance attack.', cost: 10, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.8 },
    { id: 'r_pois', name: 'Poison Blade', desc: 'Inflicts poison.', cost: 12, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.0 },
    { id: 'r_gold', name: 'Pickpocket', desc: 'Steal gold/item.', cost: 5, type: 'special', targetType: 'enemy', minLevel: 4 },
    { id: 'r_blind', name: 'Sand Throw', desc: 'Lowers enemy ACC.', cost: 8, type: 'special', targetType: 'enemy', minLevel: 8 },
    { id: 'r_inv', name: 'Vanish', desc: 'Buff Evasion.', cost: 15, type: 'buff', targetType: 'self', minLevel: 12 },
    { id: 'r_multi', name: 'Multistab', desc: 'Hit 3 times.', cost: 20, type: 'attack', targetType: 'enemy', minLevel: 16, basePower: 0.7 },
    { id: 'r_exposed', name: 'Expose Weak', desc: 'Lower enemy DEF.', cost: 15, type: 'special', targetType: 'enemy', minLevel: 20 },
    { id: 'r_venom', name: 'Neurotoxin', desc: 'Stronger Poison.', cost: 25, type: 'attack', targetType: 'enemy', minLevel: 24, basePower: 1.2 },
    { id: 'r_shadow', name: 'Shadow Step', desc: 'High dmg, ignores DEF.', cost: 30, type: 'attack', targetType: 'enemy', minLevel: 28, basePower: 1.5 },
    { id: 'r_fan', name: 'Fan of Knives', desc: 'AOE damage.', cost: 35, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 35, basePower: 1.3 },
    { id: 'r_assass', name: 'Assassinate', desc: 'Crit if target < 50% HP.', cost: 40, type: 'attack', targetType: 'enemy', minLevel: 40, basePower: 2.2 },
    { id: 'r_smoke', name: 'Smoke Bomb', desc: 'Party Evasion Buff.', cost: 45, type: 'buff', targetType: 'ally', isAoe: true, minLevel: 45 },
    { id: 'r_mug', name: 'Mug', desc: 'Dmg + Steal.', cost: 30, type: 'attack', targetType: 'enemy', minLevel: 50, basePower: 1.5 },
    { id: 'r_dance', name: 'Death Dance', desc: '7 Hits random targets.', cost: 55, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 55, basePower: 0.5 },
    { id: 'r_end', name: 'The End', desc: 'Massive Critical.', cost: 70, type: 'attack', targetType: 'enemy', minLevel: 60, basePower: 3.5 },
    // Passive
    { id: 'r_p_quick', name: 'Quick Step', desc: 'Passive DEX boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 2, passiveStat: 'dex', passiveVal: 5 },
    { id: 'r_p_luck', name: 'Lucky', desc: 'Passive Crit boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 6, passiveStat: 'critChance', passiveVal: 5 },
    { id: 'r_p_eyes', name: 'Hawk Eyes', desc: 'Passive ACC boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 10, passiveStat: 'acc', passiveVal: 10 },
    { id: 'r_p_agile', name: 'Agility', desc: 'Passive EVA boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 18, passiveStat: 'eva', passiveVal: 10 },
    { id: 'r_p_greed', name: 'Greed', desc: 'Passive CHA boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 26, passiveStat: 'cha', passiveVal: 10 },
    { id: 'r_p_dead', name: 'Deadly', desc: 'Passive CritDMG', cost: 0, type: 'passive', targetType: 'self', minLevel: 34, passiveStat: 'critDamage', passiveVal: 20 },
    { id: 'r_p_swift', name: 'Swiftness', desc: 'Large DEX boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 42, passiveStat: 'dex', passiveVal: 15 },
    { id: 'r_p_shad', name: 'Shadow', desc: 'Large EVA boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 55, passiveStat: 'eva', passiveVal: 20 }
];

const CLERIC_SKILLS: Skill[] = [
    // Active
    { id: 'c_heal', name: 'Heal', desc: 'Restores HP.', cost: 10, type: 'heal', targetType: 'ally', minLevel: 1 },
    { id: 'c_smite', name: 'Smite', desc: 'Holy damage.', cost: 12, type: 'special', targetType: 'enemy', minLevel: 1, basePower: 1.3 },
    { id: 'c_cure', name: 'Cure', desc: 'Removes Debuffs.', cost: 8, type: 'heal', targetType: 'ally', minLevel: 4 },
    { id: 'c_bless', name: 'Blessing', desc: 'Buff Strength.', cost: 15, type: 'buff', targetType: 'ally', minLevel: 8 },
    { id: 'c_prot', name: 'Protect', desc: 'Buff Defense.', cost: 15, type: 'buff', targetType: 'ally', minLevel: 12 },
    { id: 'c_group', name: 'Group Heal', desc: 'Heal all allies.', cost: 25, type: 'heal', targetType: 'ally', isAoe: true, minLevel: 16 },
    { id: 'c_revive', name: 'Revive', desc: 'Resurrect Ally.', cost: 40, type: 'heal', targetType: 'ally', minLevel: 20, revive: true },
    { id: 'c_regen', name: 'Regen', desc: 'Heal over time.', cost: 20, type: 'buff', targetType: 'ally', minLevel: 24 },
    { id: 'c_holy', name: 'Holy Nova', desc: 'AOE Holy damage.', cost: 35, type: 'special', targetType: 'enemy', isAoe: true, minLevel: 28, basePower: 1.5 },
    { id: 'c_divine', name: 'Divine Heal', desc: 'Full HP Heal.', cost: 50, type: 'heal', targetType: 'ally', minLevel: 35 },
    { id: 'c_sanc', name: 'Sanctuary', desc: 'Party Shield.', cost: 45, type: 'buff', targetType: 'ally', isAoe: true, minLevel: 40 },
    { id: 'c_judg', name: 'Judgment', desc: 'Massive Holy dmg.', cost: 50, type: 'special', targetType: 'enemy', minLevel: 45, basePower: 2.5 },
    { id: 'c_prayer', name: 'Prayer', desc: 'Restore Party MP.', cost: 0, type: 'heal', targetType: 'ally', isAoe: true, minLevel: 50 },
    { id: 'c_mass_rev', name: 'Mass Revive', desc: 'Resurrect All.', cost: 80, type: 'heal', targetType: 'ally', isAoe: true, minLevel: 55, revive: true },
    { id: 'c_miracle', name: 'Miracle', desc: 'Full Heal + Buffs.', cost: 90, type: 'heal', targetType: 'ally', isAoe: true, minLevel: 60 },
    // Passive
    { id: 'c_p_faith', name: 'Faith', desc: 'Passive MP boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 2, passiveStat: 'maxMp', passiveVal: 20 },
    { id: 'c_p_will', name: 'Iron Will', desc: 'Passive RES boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 6, passiveStat: 'mDef', passiveVal: 5 },
    { id: 'c_p_grace', name: 'Grace', desc: 'Passive INT boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 10, passiveStat: 'int', passiveVal: 5 },
    { id: 'c_p_life', name: 'Life', desc: 'Passive HP boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 18, passiveStat: 'maxHp', passiveVal: 30 },
    { id: 'c_p_merc', name: 'Mercy', desc: 'Passive CHA boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 26, passiveStat: 'cha', passiveVal: 10 },
    { id: 'c_p_aur', name: 'Aura', desc: 'Passive MAG boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 34, passiveStat: 'mAtk', passiveVal: 10 },
    { id: 'c_p_sanct', name: 'Sanctity', desc: 'Passive RES boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 42, passiveStat: 'mDef', passiveVal: 15 },
    { id: 'c_p_div', name: 'Divinity', desc: 'Large MAG boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 55, passiveStat: 'mAtk', passiveVal: 20 }
];

const BARBARIAN_SKILLS: Skill[] = [
    // Active
    { id: 'b_rage', name: 'Rage', desc: 'Buff ATK, lower DEF.', cost: 5, type: 'buff', targetType: 'self', minLevel: 1 },
    { id: 'b_shout', name: 'Battle Shout', desc: 'Buff Party ATK.', cost: 10, type: 'buff', targetType: 'ally', isAoe: true, minLevel: 1 },
    { id: 'b_smash', name: 'Smash', desc: 'Heavy single hit.', cost: 8, type: 'attack', targetType: 'enemy', minLevel: 4, basePower: 1.4 },
    { id: 'b_whirl', name: 'Whirlwind', desc: 'Hit all enemies.', cost: 15, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 8, basePower: 0.9 },
    { id: 'b_blood', name: 'Bloodlust', desc: 'Heal on hit.', cost: 12, type: 'attack', targetType: 'enemy', minLevel: 12, basePower: 1.1 },
    { id: 'b_crush', name: 'Skull Crush', desc: 'Lower enemy DEF.', cost: 15, type: 'special', targetType: 'enemy', minLevel: 16, basePower: 1.3 },
    { id: 'b_ignore', name: 'Ignore Pain', desc: 'Temp HP Boost.', cost: 20, type: 'buff', targetType: 'self', minLevel: 20 },
    { id: 'b_zerk', name: 'Berserk', desc: 'Multi-hit, low acc.', cost: 25, type: 'attack', targetType: 'enemy', minLevel: 24, basePower: 1.8 },
    { id: 'b_fear', name: 'Fear Roar', desc: 'Stun enemies.', cost: 30, type: 'special', targetType: 'enemy', isAoe: true, minLevel: 28 },
    { id: 'b_execute', name: 'Decapitate', desc: 'Fatal to low HP.', cost: 35, type: 'attack', targetType: 'enemy', minLevel: 35, basePower: 2.8 },
    { id: 'b_ram', name: 'Battering Ram', desc: 'High Dmg + Recoil.', cost: 30, type: 'attack', targetType: 'enemy', minLevel: 40, basePower: 2.2 },
    { id: 'b_endure', name: 'Undying', desc: 'Cannot die for 2 turns.', cost: 50, type: 'buff', targetType: 'self', minLevel: 45 },
    { id: 'b_quake', name: 'Earthshatter', desc: 'Massive AOE.', cost: 45, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 50, basePower: 2.0 },
    { id: 'b_frenzy', name: 'Frenzy', desc: 'Max ATK, 0 DEF.', cost: 40, type: 'buff', targetType: 'self', minLevel: 55 },
    { id: 'b_cataclysm', name: 'Cataclysm', desc: 'Ultimate Damage.', cost: 80, type: 'attack', targetType: 'enemy', minLevel: 60, basePower: 4.5 },
    // Passive
    { id: 'b_p_str', name: 'Muscle', desc: 'Passive STR boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 2, passiveStat: 'str', passiveVal: 5 },
    { id: 'b_p_hp', name: 'Thick Skin', desc: 'Passive HP boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 6, passiveStat: 'maxHp', passiveVal: 30 },
    { id: 'b_p_dmg', name: 'Brutality', desc: 'Passive ATK boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 10, passiveStat: 'atk', passiveVal: 8 },
    { id: 'b_p_crit', name: 'Reckless', desc: 'Passive Crit boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 18, passiveStat: 'critChance', passiveVal: 8 },
    { id: 'b_p_vit', name: 'Iron Gut', desc: 'Passive VIT boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 26, passiveStat: 'vit', passiveVal: 8 },
    { id: 'b_p_cdmg', name: 'Savagery', desc: 'Passive CritDMG', cost: 0, type: 'passive', targetType: 'self', minLevel: 34, passiveStat: 'critDamage', passiveVal: 25 },
    { id: 'b_p_res', name: 'Resilience', desc: 'Passive RES boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 42, passiveStat: 'mDef', passiveVal: 10 },
    { id: 'b_p_titan', name: 'Titan', desc: 'Massive STR boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 55, passiveStat: 'str', passiveVal: 15 }
];

const ARCHER_SKILLS: Skill[] = [
    // Active
    { id: 'a_shot', name: 'Power Shot', desc: 'Strong single hit.', cost: 8, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.3 },
    { id: 'a_volley', name: 'Volley', desc: 'Hit random enemies.', cost: 12, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 1, basePower: 0.8 },
    { id: 'a_eye', name: 'Eagle Eye', desc: 'Buff Accuracy/Crit.', cost: 10, type: 'buff', targetType: 'self', minLevel: 4 },
    { id: 'a_fire', name: 'Fire Arrow', desc: 'Burn damage.', cost: 12, type: 'attack', targetType: 'enemy', minLevel: 8, basePower: 1.1 },
    { id: 'a_pin', name: 'Pinning Shot', desc: 'Lower enemy EVA.', cost: 15, type: 'special', targetType: 'enemy', minLevel: 12, basePower: 1.0 },
    { id: 'a_pierce', name: 'Pierce', desc: 'Ignore Defense.', cost: 18, type: 'attack', targetType: 'enemy', minLevel: 16, basePower: 1.2 },
    { id: 'a_rain', name: 'Arrow Rain', desc: 'AOE damage.', cost: 25, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 20, basePower: 1.3 },
    { id: 'a_head', name: 'Headshot', desc: 'High Crit chance.', cost: 30, type: 'attack', targetType: 'enemy', minLevel: 24, basePower: 1.8 },
    { id: 'a_poison', name: 'Toxic Shot', desc: 'Strong Poison.', cost: 20, type: 'special', targetType: 'enemy', minLevel: 28, basePower: 1.0 },
    { id: 'a_multi', name: 'Multishot', desc: 'Hit 4 times.', cost: 35, type: 'attack', targetType: 'enemy', minLevel: 35, basePower: 0.6 },
    { id: 'a_snare', name: 'Snare', desc: 'Stun enemy.', cost: 30, type: 'special', targetType: 'enemy', minLevel: 40 },
    { id: 'a_conc', name: 'Concentrate', desc: 'Next hit 100% crit.', cost: 40, type: 'buff', targetType: 'self', minLevel: 45 },
    { id: 'a_blast', name: 'Explosive', desc: 'Heavy AOE.', cost: 45, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 50, basePower: 2.0 },
    { id: 'a_snipe', name: 'Snipe', desc: 'Massive range dmg.', cost: 60, type: 'attack', targetType: 'enemy', minLevel: 55, basePower: 3.5 },
    { id: 'a_god', name: 'Apollo', desc: 'Ultimate Volley.', cost: 80, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 60, basePower: 3.0 },
    // Passive
    { id: 'a_p_dex', name: 'Deadeye', desc: 'Passive DEX boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 2, passiveStat: 'dex', passiveVal: 5 },
    { id: 'a_p_acc', name: 'Steady', desc: 'Passive ACC boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 6, passiveStat: 'acc', passiveVal: 10 },
    { id: 'a_p_crit', name: 'Precision', desc: 'Passive Crit boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 10, passiveStat: 'critChance', passiveVal: 8 },
    { id: 'a_p_eva', name: 'Evasion', desc: 'Passive EVA boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 18, passiveStat: 'eva', passiveVal: 8 },
    { id: 'a_p_spd', name: 'Reflex', desc: 'Passive DEX boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 26, passiveStat: 'dex', passiveVal: 8 },
    { id: 'a_p_cdmg', name: 'Lethal', desc: 'Passive CritDMG', cost: 0, type: 'passive', targetType: 'self', minLevel: 34, passiveStat: 'critDamage', passiveVal: 20 },
    { id: 'a_p_range', name: 'Longbow', desc: 'Passive ATK boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 42, passiveStat: 'atk', passiveVal: 10 },
    { id: 'a_p_master', name: 'Mastery', desc: 'Massive DEX boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 55, passiveStat: 'dex', passiveVal: 15 }
];

export const CLASSES: ClassDefinition[] = [
  {
    type: 'WARRIOR',
    avatar: AVATAR_WARRIOR,
    description: "A stalwart defender. High HP and Defense. Uses Rage to fuel attacks.",
    hp: 120, mp: 40, str: 8, int: 2, dex: 4, vit: 8, cha: 3,
    skillPool: WARRIOR_SKILLS,
    starterSkillIds: ['w_bash', 'w_cleave']
  },
  {
    type: 'MAGE',
    avatar: AVATAR_MAGE,
    description: "Master of elements. High Magic Attack and MP. Low Defense.",
    hp: 70, mp: 120, str: 2, int: 10, dex: 5, vit: 3, cha: 4,
    skillPool: MAGE_SKILLS,
    starterSkillIds: ['m_fire', 'm_surge']
  },
  {
    type: 'ROGUE',
    avatar: AVATAR_ROGUE,
    description: "Shadow dweller. High Critical and Evasion. Deals burst damage.",
    hp: 90, mp: 60, str: 5, int: 3, dex: 10, vit: 4, cha: 2,
    skillPool: ROGUE_SKILLS,
    starterSkillIds: ['r_dage', 'r_pois']
  },
  {
    type: 'CLERIC',
    avatar: AVATAR_CLERIC,
    description: "Holy healer. Keeps the party alive. Decent Defense.",
    hp: 100, mp: 100, str: 4, int: 8, dex: 3, vit: 6, cha: 5,
    skillPool: CLERIC_SKILLS,
    starterSkillIds: ['c_heal', 'c_smite']
  },
  {
    type: 'BARBARIAN',
    avatar: AVATAR_BARBARIAN,
    description: "Savage fighter. High HP and Strength. Low Magic Defense.",
    hp: 140, mp: 30, str: 10, int: 1, dex: 5, vit: 7, cha: 2,
    skillPool: BARBARIAN_SKILLS,
    starterSkillIds: ['b_rage', 'b_smash']
  },
  {
    type: 'ARCHER',
    avatar: AVATAR_ARCHER,
    description: "Ranged striker. High Accuracy and Dexterity. Balanced stats.",
    hp: 90, mp: 70, str: 5, int: 3, dex: 9, vit: 5, cha: 3,
    skillPool: ARCHER_SKILLS,
    starterSkillIds: ['a_shot', 'a_volley']
  }
];

export const generateDungeon = (): number[][][] => {
    const floors: number[][][] = [];
    const floorCount = 5;

    for (let f = 0; f < floorCount; f++) {
        // Init full wall
        const map: number[][] = Array(DUNGEON_SIZE).fill(0).map(() => Array(DUNGEON_SIZE).fill(1));

        // Simple Random Walk Carving
        let x = 1;
        let y = 1;
        map[y][x] = 0; // Start point
        
        let steps = 150;
        while (steps > 0) {
            const dir = Math.floor(Math.random() * 4);
            let nx = x;
            let ny = y;
            if (dir === 0) ny--;
            else if (dir === 1) nx++;
            else if (dir === 2) ny++;
            else if (dir === 3) nx--;

            if (nx > 0 && nx < DUNGEON_SIZE - 1 && ny > 0 && ny < DUNGEON_SIZE - 1) {
                x = nx;
                y = ny;
                if (Math.random() < 0.1 && f > 0) {
                     // 10% chance to place secret wall instead of floor, but not on floor 0 start path generally
                     // Keeping it simple for now:
                     map[y][x] = 0;
                } else {
                     map[y][x] = 0;
                }
                steps--;
            }
        }

        // Place Stairs at last position
        map[y][x] = 3;

        // Place Guaranteed Merchant on Floor 0 at (1,2) for intro sequence
        if (f === 0) {
            // Ensure path to merchant exists
            map[2][1] = 5;
            map[1][1] = 0; // Start
            // Ensure clear space around
            map[1][2] = 0;
            map[2][2] = 0;
        } else {
            // Random Merchant on other floors
            let placed = false;
            while (!placed) {
                const rx = Math.floor(Math.random() * (DUNGEON_SIZE - 2)) + 1;
                const ry = Math.floor(Math.random() * (DUNGEON_SIZE - 2)) + 1;
                if (map[ry][rx] === 0) {
                    map[ry][rx] = 5;
                    placed = true;
                }
            }
        }

        // Place Chests
        let chests = 3;
        while (chests > 0) {
            const rx = Math.floor(Math.random() * (DUNGEON_SIZE - 2)) + 1;
            const ry = Math.floor(Math.random() * (DUNGEON_SIZE - 2)) + 1;
            if (map[ry][rx] === 0) {
                map[ry][rx] = 4;
                chests--;
            }
        }
        
        // Place Traveler (NPC) occasionally
        if (Math.random() < 0.4) {
            let placed = false;
            while (!placed) {
                const rx = Math.floor(Math.random() * (DUNGEON_SIZE - 2)) + 1;
                const ry = Math.floor(Math.random() * (DUNGEON_SIZE - 2)) + 1;
                if (map[ry][rx] === 0) {
                    map[ry][rx] = 6;
                    placed = true;
                }
            }
        }
        
        floors.push(map);
    }
    return floors;
};
