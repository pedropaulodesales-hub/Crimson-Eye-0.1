
import { Item, Enemy, Skill, PlayerClass, ItemMod, ClassDefinition } from './types';

export const DUNGEON_SIZE = 20;

/**
 * MERCHANT_AVATAR: A high-detail pixel-art cyber face.
 */
export const MERCHANT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj4KICA8IS0tIEhvb2QgLS0+CiAgPHJlY3QgeD0iMTYiIHk9IjgiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCIgZmlsbD0iIzAwMTMwMCIvPgogIDxyZWN0IHg9IjIwIiB5PSI0IiB3aWR0aD0iMjQiIGhlaWdodD0iNTIiIGZpbGw9IiMwMDEzMDAiLz4KICA8IS0tIEZhY2UgQmFzZSAtLT4KICA8cmVjdCB4PSIyNCIgeT0iMTYiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwMzMwMCIvPgogIDxyZWN0IHg9IjI2IiB5PSIxNCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDMzMDAiLz4KICA8IS0tIENoZWVrYm9uZXMgJiBGb3JlaGVhZCAtLT4KICA8cmVjdCB4PSIyOCIgeT0iMTYiIHdpZHRoPSI4IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDA0NDAwIi8+CiAgPHJlY3QgeD0iMjYiIHk9IjIwIiB3aWR0aD0iMTIiIGhlaWdodD0iNCIgZmlsbD0iIzAwNDQwMCIvPgogIDwhLS0gRXllIFNvY2tldHMgLS0+CiAgPHJlY3QgeD0iMjciIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAxMTAwIi8+CiAgPHJlY3QgeD0iMzMiIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAxMTAwIi8+CiAgPCEtLSBHbG93aW5nIFB1cGlscyAtLT4KICA8cmVjdCB4PSIyOCIgeT0iMjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiMzM2ZmMzMiLz4KICA8cmVjdCB4PSIzNCIgeT0iMjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiMzM2ZmMzMiLz4KICA8cmVjdCB4PSIyOSIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYiLz4KICA8cmVjdCB4PSIzNSIgeT0iMjQiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYiLz4KICA8IS0tIE5vc2UgLS0+CiAgPHJlY3QgeD0iMzEiIHk9IjI4IiB3aWR0aD0iMiIgaGVpZ2h0PSIzIiBmaWxsPSIjMDAyMjAwIi8+CiAgPCEtLSBNb3V0aCAvIENoaW4gLS0+CiAgPHJlY3QgeD0iMzAiIHk9IjM2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAxMTAwIi8+CiAgPHJlY3QgeD0iMjgiIHk9IjM4IiB3aWR0aD0iOCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAyMjAwIi8+CiAgPCEtLSBEaWdpdGFsIEJlYXJkIC0tPgogIDxyZWN0IHg9IjI2IiB5PSI0MCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDY2MDAiIG9wYWNpdHk9IjAuNiIvPgogIDxyZWN0IHg9IjI0IiB5PSI0NCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMDY2MDAiIG9wYWNpdHk9IjAuMyIvPgogIDwhLS0gU2NhbiBMaW5lcyAtLT4KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9InVybCgjZ3JpZCkiIG9wYWNpdHk9IjAuMCIvPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMGZmMDAiIG9wYWNpdHk9IjAuMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KPC9zdmc+";

// TRAVELER AVATAR (Brown/Rogue-ish)
export const AVATAR_TRAVELER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIENsb2FrIC0tPjxyZWN0IHg9IjE2IiB5PSI4IiB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIGZpbGw9IiM1YzQwMzMiLz48cmVjdCB4PSIyMCIgeT0iNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjUyIiBmaWxsPSIjNWM0MDMzIi8+PCEtLSBEYXJrIEludGVyaW9yIC0tPjxyZWN0IHg9IjI0IiB5PSIxNiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMmUyZTMzIi8+PCEtLSBFeWVzIChIaWRkZW4gaW4gc2hhZG93KSAtLT48cmVjdCB4PSIyNiIgeT0iMjAiIHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiNhYWZmYWEiIG9wYWNpdHk9IjAuNiIvPjxyZWN0IHg9IjM0IiB5PSIyMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iI2FhZmZhYSIgb3BhY2l0eT0iMC42Ii8+PCEtLSBTY2FyZiAtLT48cmVjdCB4PSIyMiIgeT0iMzIiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiBmaWxsPSIjOGI0NTEzIi8+PCEtLSBCcm9vY2ggLS0+PHJlY3QgeD0iMzAiIHk9IjM0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZkNTAwIi8+PC9zdmc+";

// ENEMY AVATARS
export const AVATAR_BAT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIFdpbmdzIC0tPjxyZWN0IHg9IjQiIHk9IjIwIiB3aWR0aD0iNTYiIGhlaWdodD0iMiIgZmlsbD0iIzRhMTA1NCIvPjxyZWN0IHg9IjQiIHk9IjIyIiB3aWR0aD0iNTYiIGhlaWdodD0iNCIgZmlsbD0iIzJkMDgwMCIgLz48cmVjdCB4PSI4IiB5PSIyNiIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjYiIGZpbGw9IiMyZDA4MDAiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjEyIiB5PSIzMiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjYiIGZpbGw9IiMyZDA4MDAiIG9wYWNpdHk9IjAuNiIvPjwhLS0gQm9keSAtLT48cmVjdCB4PSIyNCIgeT0iMjQiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxOCIgZmlsbD0iIzEwMTAxMCIvPjwhLS0gRWFycyAtLT48cmVjdCB4PSIyNiIgeT0iMTgiIHdpZHRoPSI0IiBoZWlnaHQ9IjYiIGZpbGw9IiMxMDEwMTAiLz48cmVjdCB4PSIzNCIgeT0iMTgiIHdpZHRoPSI0IiBoZWlnaHQ9IjYiIGZpbGw9IiMxMDEwMTAiLz48IS0tIEV5ZXMgLS0+PHJlY3QgeD0iMjciIHk9IjI4IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiBmaWxsPSIjZmYwMDAwIi8+PHJlY3QgeD0iMzQiIHk9IjI4IiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiBmaWxsPSIjZmYwMDAwIi8+PjwhLS0gQ3liZXIgLS0+PHJlY3QgeD0iMzAiIHk9IjMyIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDBmZmZmIiBvcGFjaXR5PSIwLjgiLz48cmVjdCB4PSI0IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iMTIiIGZpbGw9IiM4ODAwODgiLz48cmVjdCB4PSI1OCIgeT0iMjAiIHdpZHRoPSIyIiBoZWlnaHQ9IjEyIiBmaWxsPSIjODgwMDg4Ii8+PC9zdmc+";

export const AVATAR_SLIME = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48IS0tIE1haW4gQmxvYiAtLT48cmVjdCB4PSIxNiIgeT0iMjgiIHdpZHRoPSIzMiIgaGVpZ2h0PSIyOCIgZmlsbD0iIzAwZmYwMCIgb3BhY2l0eT0iMC42Ii8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgZmlsbD0iIzAwZmYwMCIgb3BhY2l0eT0iMC42Ii8+PCEtLSBDb3JlIC0tPjxyZWN0IHg9IjI0IiB5PSIzMiIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDA2NjAwIi8+PCEtLSBXZXQgU3BvdHMgLS0+PHJlY3QgeD0iMjIiIHk9IjI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSIzOCIgeT0iMzYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNSIvPjwhLS0gR2xpdGNoIENpcmN1aXRzIC0tPjxyZWN0IHg9IjI2IiB5PSIzNiIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjI2IiB5PSI0MCIgd2lkdGg9IjEiIGhlaWdodD0iNCIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjMyIiB5PSI0MCIgd2lkdGg9IjEiIGhlaWdodD0iNCIgZmlsbD0iIzAwZmZmZiIvPjxyZWN0IHg9IjE4IiB5PSI0OCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjQyIiB5PSI0OCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzMzZmYzMyIvPjwvc3ZnPg==";

// AVATAR DEFINITIONS
const AVATAR_WARRIOR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNiIgeT0iMTIiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjE4IiB5PSIxMCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIyMCIgeT0iMjQiIHdpZHRoPSIyNCIgaGVpZ2h0PSI2IiBmaWxsPSIjMDAwMDAwIi8+PHJlY3QgeD0iMjIiIHk9IjI2IiB3aWR0aD0iMjAiIGhlaWdodD0iMiIgZmlsbD0iIzMzZmYzMyIvPjxyZWN0IHg9IjMwIiB5PSIzMiIgd2lkdGg9IjQiIGhlaWdodD0iMTQiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIyMiIgeT0iMzQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDA0NDAwIi8+PHJlY3QgeD0iMjQiIHk9IjQ4IiB3aWR0aD0iMTYiIGhlaWdodD0iNCIgZmlsbD0iIzAwNTUwMCIvPjwvc3ZnPg==";
const AVATAR_MAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNCIgeT0iOCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMDAyMjAwIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjgiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIyMiIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzM2ZmMzMiLz48cmVjdCB4PSIzOCIgeT0iMjYiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzM2ZmMzMiLz48cmVjdCB4PSIyNCIgeT0iMjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSI0MCIgeT0iMjgiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIzMCIgeT0iNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDU1MDAiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==";
const AVATAR_CLERIC = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwNDQwMCIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDAxMTAwIi8+PHJlY3QgeD0iMjQiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjNjZmZjY2Ii8+PHJlY3QgeD0iMzYiIHk9IjI2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjNjZmZjY2Ii8+PHJlY3QgeD0iMzAiIHk9IjgiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjI4IiB5PSIzNCIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iIzAwNjYwMCIvPjwvc3ZnPg==";
const AVATAR_BARBARIAN = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjE0IiB5PSI4IiB3aWR0aD0iMzYiIGhlaWdodD0iMTIiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIxMiIgeT0iMTIiIHdpZHRoPSI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDA1NTAwIi8+PHJlY3QgeD0iNDgiIHk9IjEyIiB3aWR0aD0iNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjIyIiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjM2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjIzIiB5PSIyNSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjM3IiB5PSIyNSIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjIyIiB5PSIzMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjM4IiB5PSIzMCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwNTUwMCIvPjxyZWN0IHg9IjMwIiB5PSIzOCIgd2lkdGg9IjQiIGhlaWdodD0iMiIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg==";
const AVATAR_ARCHER = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDA1NTAwIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjgiIGZpbGw9IiMwMDIyMDAiLz48cmVjdCB4PSIyNCIgeT0iMjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzM2ZmMzMiLz48cmVjdCB4PSIzMCIgeT0iMjIiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwNDQwMCIvPjxyZWN0IHg9IjMyIiB5PSIyNCIgd2lkdGg9IjgiIGhlaWdodD0iNiIgZmlsbD0iIzAwZmYwMCIgb3BhY2l0eT0iMC41Ii8+PHJlY3QgeD0iMzUiIHk9IjI2IiB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmZmZmIi8+PHJlY3QgeD0iMzAiIHk9IjQwIiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAwMDAwIi8+PC9zdmc+";
const AVATAR_ROGUE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB4PSIxOCIgeT0iMTIiIHdpZHRoPSIyOCIgaGVpZ2h0PSIzNiIgZmlsbD0iIzAwMzMwMCIvPjxyZWN0IHg9IjIwIiB5PSIyNCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjYiIGZpbGw9IiMwMDU1MDAiLz48cmVjdCB4PSIzNCIgeT0iMjQiIHdpZHRoPSIxMCIgaGVpZ2h0PSI2IiBmaWxsPSIjMDA1NTAwIi8+PHJlY3QgeD0iMjIiIHk9IjI1IiB3aWR0aD0iNiIgaGVpZ2h0PSI0IiBmaWxsPSIjZmYwMDAwIiBvcGFjaXR5PSIwLjUiLz48cmVjdCB4PSIzNiIgeT0iMjUiIHdpZHRoPSI2IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNSIvPjxyZWN0IHg9IjE4IiB5PSIzNCIgd2lkdGg9IjI4IiBoZWlnaHQ9IjE0IiBmaWxsPSIjMDAyMjAwIi8+PHJlY3QgeD0iMzAiIHk9IjM2IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjMDAxMTAwIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=";

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
        avatar: AVATAR_TRAVELER
    }
];

// --- SKILLS EXPANSION ---
// 15 Actives + 8 Passives per class. 
// Starting skills: Warrior (Bash, Cleave), Mage (Fireball, Mana Surge), Rogue (Backstab, Poison), 
// Cleric (Heal, Smite), Barbarian (Rage, Shout), Archer (Power Shot, Volley)

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
    { id: 'c_p_div', name: 'Divinity', desc: 'Large MP boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 42, passiveStat: 'maxMp', passiveVal: 80 },
    { id: 'c_p_saint', name: 'Saint', desc: 'Large INT boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 55, passiveStat: 'int', passiveVal: 20 }
];

const BARBARIAN_SKILLS: Skill[] = [
    // Active
    { id: 'b_rage', name: 'Rage Strike', desc: 'High damage, cost HP.', cost: 0, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 2.0 },
    { id: 'b_shout', name: 'War Cry', desc: 'Buff Party Atk.', cost: 20, type: 'buff', targetType: 'ally', isAoe: true, minLevel: 1 },
    { id: 'b_smash', name: 'Smash', desc: 'Basic strong hit.', cost: 8, type: 'attack', targetType: 'enemy', minLevel: 4, basePower: 1.3 },
    { id: 'b_endure', name: 'Endure', desc: 'Buff VIT + Heal.', cost: 15, type: 'buff', targetType: 'self', minLevel: 8 },
    { id: 'b_blood', name: 'Bloodthirst', desc: 'Attack drains HP.', cost: 10, type: 'attack', targetType: 'enemy', minLevel: 12, basePower: 1.2 },
    { id: 'b_berserk', name: 'Berserk', desc: 'Gain ATK, Lose DEF.', cost: 20, type: 'buff', targetType: 'self', minLevel: 16 },
    { id: 'b_whirl', name: 'Whirlwind', desc: 'Hit all enemies.', cost: 25, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 20, basePower: 1.0 },
    { id: 'b_crush', name: 'Skull Crush', desc: 'Lower enemy DEF.', cost: 18, type: 'attack', targetType: 'enemy', minLevel: 24, basePower: 1.4 },
    { id: 'b_roar', name: 'Intimidating Roar', desc: 'Stun enemies.', cost: 30, type: 'special', targetType: 'enemy', isAoe: true, minLevel: 28 },
    { id: 'b_exec', name: 'Guillotine', desc: 'Massive dmg, low ACC.', cost: 35, type: 'attack', targetType: 'enemy', minLevel: 35, basePower: 3.0 },
    { id: 'b_ignore', name: 'Ignore Pain', desc: 'Temp Invincibility.', cost: 50, type: 'buff', targetType: 'self', minLevel: 40 },
    { id: 'b_quake', name: 'Earth Slam', desc: 'AOE + Slow.', cost: 40, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 45, basePower: 1.5 },
    { id: 'b_frenzy', name: 'Frenzy', desc: '5 Random hits.', cost: 50, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 50, basePower: 0.8 },
    { id: 'b_titan', name: 'Titan Form', desc: 'Double Max HP.', cost: 60, type: 'buff', targetType: 'self', minLevel: 55 },
    { id: 'b_catac', name: 'Cataclysm', desc: 'All HP to Dmg.', cost: 0, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 60, basePower: 5.0 },
    // Passive
    { id: 'b_p_flesh', name: 'Iron Flesh', desc: 'Passive HP boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 2, passiveStat: 'maxHp', passiveVal: 50 },
    { id: 'b_p_str', name: 'Muscle', desc: 'Passive STR boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 6, passiveStat: 'str', passiveVal: 5 },
    { id: 'b_p_tough', name: 'Toughness', desc: 'Passive VIT boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 10, passiveStat: 'vit', passiveVal: 5 },
    { id: 'b_p_brawl', name: 'Brawler', desc: 'Passive ATK boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 18, passiveStat: 'atk', passiveVal: 5 },
    { id: 'b_p_thick', name: 'Thick Skin', desc: 'Passive DEF boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 26, passiveStat: 'def', passiveVal: 10 },
    { id: 'b_p_vis', name: 'Vigor', desc: 'Passive HP boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 34, passiveStat: 'maxHp', passiveVal: 100 },
    { id: 'b_p_might', name: 'Might', desc: 'Large STR boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 42, passiveStat: 'str', passiveVal: 15 },
    { id: 'b_p_imm', name: 'Immortal', desc: 'Large VIT boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 55, passiveStat: 'vit', passiveVal: 20 }
];

const ARCHER_SKILLS: Skill[] = [
    // Active
    { id: 'a_shot', name: 'Power Shot', desc: 'Strong ranged attack.', cost: 8, type: 'attack', targetType: 'enemy', minLevel: 1, basePower: 1.4 },
    { id: 'a_volley', name: 'Volley', desc: 'Hit random enemies.', cost: 15, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 1, basePower: 0.7 },
    { id: 'a_fire', name: 'Fire Arrow', desc: 'Burn target.', cost: 12, type: 'attack', targetType: 'enemy', minLevel: 4, basePower: 1.1 },
    { id: 'a_eye', name: 'Eagle Eye', desc: 'Buff Crit Chance.', cost: 12, type: 'buff', targetType: 'self', minLevel: 8 },
    { id: 'a_ice', name: 'Ice Arrow', desc: 'Slow target.', cost: 12, type: 'attack', targetType: 'enemy', minLevel: 12, basePower: 1.1 },
    { id: 'a_pierce', name: 'Piercing Shot', desc: 'Ignore 50% DEF.', cost: 18, type: 'attack', targetType: 'enemy', minLevel: 16, basePower: 1.3 },
    { id: 'a_poison', name: 'Toxic Shot', desc: 'Strong Poison.', cost: 15, type: 'attack', targetType: 'enemy', minLevel: 20, basePower: 1.0 },
    { id: 'a_multi', name: 'Multishot', desc: 'AOE damage.', cost: 25, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 24, basePower: 1.0 },
    { id: 'a_snare', name: 'Snare Trap', desc: 'Stun enemy.', cost: 20, type: 'special', targetType: 'enemy', minLevel: 28 },
    { id: 'a_snipe', name: 'Snipe', desc: 'High Crit Dmg.', cost: 30, type: 'attack', targetType: 'enemy', minLevel: 35, basePower: 2.5 },
    { id: 'a_rain', name: 'Arrow Rain', desc: 'Massive AOE.', cost: 40, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 40, basePower: 1.5 },
    { id: 'a_conc', name: 'Concentrate', desc: 'Next hit 100% Crit.', cost: 30, type: 'buff', targetType: 'self', minLevel: 45 },
    { id: 'a_explo', name: 'Explosive', desc: 'Fire AOE.', cost: 45, type: 'attack', targetType: 'enemy', isAoe: true, minLevel: 50, basePower: 1.8 },
    { id: 'a_phantom', name: 'Phantom', desc: 'Buff Evasion.', cost: 35, type: 'buff', targetType: 'self', minLevel: 55 },
    { id: 'a_ballista', name: 'Ballista', desc: 'Ultimate Shot.', cost: 60, type: 'attack', targetType: 'enemy', minLevel: 60, basePower: 4.0 },
    // Passive
    { id: 'a_p_prec', name: 'Precision', desc: 'Passive ACC boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 2, passiveStat: 'acc', passiveVal: 10 },
    { id: 'a_p_dex', name: 'Finesse', desc: 'Passive DEX boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 6, passiveStat: 'dex', passiveVal: 5 },
    { id: 'a_p_keen', name: 'Keen Eye', desc: 'Passive Crit boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 10, passiveStat: 'critChance', passiveVal: 5 },
    { id: 'a_p_luck', name: 'Fortune', desc: 'Passive CHA boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 18, passiveStat: 'cha', passiveVal: 10 },
    { id: 'a_p_mob', name: 'Mobility', desc: 'Passive EVA boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 26, passiveStat: 'eva', passiveVal: 10 },
    { id: 'a_p_leth', name: 'Lethality', desc: 'Passive CritDMG', cost: 0, type: 'passive', targetType: 'self', minLevel: 34, passiveStat: 'critDamage', passiveVal: 20 },
    { id: 'a_p_mast', name: 'Bow Mastery', desc: 'Large ATK boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 42, passiveStat: 'atk', passiveVal: 15 },
    { id: 'a_p_legolas', name: 'Legend', desc: 'Large DEX boost', cost: 0, type: 'passive', targetType: 'self', minLevel: 55, passiveStat: 'dex', passiveVal: 20 }
];

export const CLASSES: ClassDefinition[] = [
  {
    type: 'WARRIOR',
    avatar: AVATAR_WARRIOR,
    description: 'A sturdy fighter who excels in defense and physical power.',
    hp: 120, mp: 30, str: 10, int: 2, dex: 5, vit: 10, cha: 3,
    skillPool: WARRIOR_SKILLS,
    starterSkillIds: ['w_bash', 'w_cleave']
  },
  {
    type: 'MAGE',
    avatar: AVATAR_MAGE,
    description: 'Master of arcane arts, dealing high magic damage.',
    hp: 70, mp: 100, str: 2, int: 12, dex: 4, vit: 3, cha: 5,
    skillPool: MAGE_SKILLS,
    starterSkillIds: ['m_fire', 'm_surge']
  },
  {
    type: 'ROGUE',
    avatar: AVATAR_ROGUE,
    description: 'Agile and cunning, skilled in critical strikes and theft.',
    hp: 90, mp: 50, str: 6, int: 4, dex: 12, vit: 4, cha: 6,
    skillPool: ROGUE_SKILLS,
    starterSkillIds: ['r_dage', 'r_pois']
  },
  {
    type: 'CLERIC',
    avatar: AVATAR_CLERIC,
    description: 'Holy healer who keeps the party alive.',
    hp: 100, mp: 80, str: 5, int: 8, dex: 3, vit: 6, cha: 8,
    skillPool: CLERIC_SKILLS,
    starterSkillIds: ['c_heal', 'c_smite']
  },
  {
    type: 'BARBARIAN',
    avatar: AVATAR_BARBARIAN,
    description: 'A rage-fueled brawler with massive health.',
    hp: 150, mp: 20, str: 12, int: 1, dex: 6, vit: 8, cha: 2,
    skillPool: BARBARIAN_SKILLS,
    starterSkillIds: ['b_rage', 'b_shout']
  },
  {
    type: 'ARCHER',
    avatar: AVATAR_ARCHER,
    description: 'Ranged specialist with keen accuracy.',
    hp: 90, mp: 40, str: 8, int: 3, dex: 10, vit: 4, cha: 4,
    skillPool: ARCHER_SKILLS,
    starterSkillIds: ['a_shot', 'a_volley']
  }
];

export const generateDungeon = (): number[][][] => {
  const floors: number[][][] = [];
  
  for (let i = 0; i < 5; i++) {
    const grid = Array(DUNGEON_SIZE).fill(0).map(() => Array(DUNGEON_SIZE).fill(1));
    let cx = 1;
    let cy = 1;
    grid[cy][cx] = 0;
    
    const floorTiles: {x: number, y: number}[] = [{x: cx, y: cy}];
    const targetFloorCount = Math.floor(DUNGEON_SIZE * DUNGEON_SIZE * 0.35);
    let currentFloorCount = 1;
    let attempts = 0;
    const maxAttempts = 5000;

    // Standard Maze Generation
    while (currentFloorCount < targetFloorCount && attempts < maxAttempts) {
      attempts++;
      const origin = Math.random() > 0.5 
        ? floorTiles[floorTiles.length - 1] 
        : floorTiles[Math.floor(Math.random() * floorTiles.length)];
      let tx = origin.x;
      let ty = origin.y;
      const dirs = [{x:0, y:-1}, {x:1, y:0}, {x:0, y:1}, {x:-1, y:0}];
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const len = 3 + Math.floor(Math.random() * 5);
      for (let j = 0; j < len; j++) {
        const nx = tx + dir.x;
        const ny = ty + dir.y;
        if (nx >= 1 && nx < DUNGEON_SIZE - 1 && ny >= 1 && ny < DUNGEON_SIZE - 1) {
           if (grid[ny][nx] === 1) {
             grid[ny][nx] = 0;
             currentFloorCount++;
             floorTiles.push({x: nx, y: ny});
           }
           tx = nx;
           ty = ny;
        } else break;
      }
    }

    const emptySpots: {x:number, y:number}[] = [];
    for (let r = 0; r < DUNGEON_SIZE; r++) {
      for (let c = 0; c < DUNGEON_SIZE; c++) {
        if (grid[r][c] === 0 && !(r === 1 && c === 1)) emptySpots.push({x: c, y: r});
      }
    }
    
    // --- SECRET PASSAGE GENERATION (Floor 1 Only) ---
    if (i === 0) {
        let secretsCreated = 0;
        const targetSecrets = 5; // 4 chests, 1 NPC
        const shuffledSpots = [...floorTiles].sort(() => Math.random() - 0.5);
        const directions = [{x:0, y:-1}, {x:1, y:0}, {x:0, y:1}, {x:-1, y:0}];

        for (const spot of shuffledSpots) {
            if (secretsCreated >= targetSecrets) break;

            // Try to find a valid wall to punch through
            for (const d of directions) {
                const wallX = spot.x + d.x;
                const wallY = spot.y + d.y;
                const secretX = spot.x + (d.x * 2);
                const secretY = spot.y + (d.y * 2);

                if (secretX > 0 && secretX < DUNGEON_SIZE - 1 && secretY > 0 && secretY < DUNGEON_SIZE - 1) {
                    // Check if the wall is a wall, and the spot behind it is also a wall (to carve a room)
                    if (grid[wallY][wallX] === 1 && grid[secretY][secretX] === 1) {
                        // Check if Secret Room has no other neighbors (keep it hidden)
                        let neighborCount = 0;
                        for (const nd of directions) {
                            if (grid[secretY + nd.y][secretX + nd.x] === 0) neighborCount++;
                        }
                        
                        if (neighborCount === 0) {
                            grid[wallY][wallX] = 9; // Illusion Wall
                            grid[secretY][secretX] = secretsCreated === 0 ? 6 : 4; // 1 NPC (6), rest Chests (4)
                            secretsCreated++;
                            break; // Move to next spot to avoid clustering
                        }
                    }
                }
            }
        }
    }
    // ------------------------------------------------

    let maxDist = -1;
    let stairSpot = emptySpots[0];
    emptySpots.forEach(spot => {
      const dist = Math.abs(spot.x - 1) + Math.abs(spot.y - 1);
      if (dist > maxDist) { maxDist = dist; stairSpot = spot; }
    });
    if (stairSpot) {
      grid[stairSpot.y][stairSpot.x] = 3;
      const idx = emptySpots.findIndex(s => s.x === stairSpot.x && s.y === stairSpot.y);
      if (idx > -1) emptySpots.splice(idx, 1);
    }
    
    const chestCount = 3 + Math.floor(Math.random() * 3);
    for (let c = 0; c < chestCount; c++) {
      if (emptySpots.length === 0) break;
      const randIdx = Math.floor(Math.random() * emptySpots.length);
      const spot = emptySpots[randIdx];
      // Don't overwrite existing specials (like secret chests created above)
      if (grid[spot.y][spot.x] === 0) {
          grid[spot.y][spot.x] = 4;
          emptySpots.splice(randIdx, 1);
      }
    }
    
    if (i === 0) {
       // STARTING MERCHANT - Guarantees visual on startup
       grid[2][1] = 5; 
       const eIdx = emptySpots.findIndex(s => s.x === 1 && s.y === 2);
       if (eIdx > -1) emptySpots.splice(eIdx, 1);
    } else if (i === 2 || Math.random() < 0.25) {
       if (emptySpots.length > 0) {
         const randIdx = Math.floor(Math.random() * emptySpots.length);
         const spot = emptySpots[randIdx];
         if (grid[spot.y][spot.x] === 0) {
            grid[spot.y][spot.x] = 5;
            emptySpots.splice(randIdx, 1);
         }
       }
    }
    floors.push(grid);
  }
  return floors;
};
