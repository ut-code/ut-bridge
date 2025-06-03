{pkgs ? import <nixpkgs> {}}: let
  prisma-utils = builtins.getFlake "github:VanCoding/nix-prisma-utils";
  prisma =
    (prisma-utils.lib.prisma-factory {
      inherit pkgs;
      schema-engine-hash = "sha256-3Z76iqOAR5ytdfOkq5XQofnUveXqoqibNjaChGKisiM=";
      query-engine-hash = "sha256-ttsqP6XJuo/iIDFX2VqyOaRKsvE9qDDk8Q7Y0aDm71s=";
      libquery-engine-hash = "sha256-oOuR8XtO3I7NDUtx/JXjzHjBxDEFO8jv3x5CgccMzjc=";
      prisma-fmt-hash = "sha256-MQnSmx4+S6lQWyn/l2CccbJZG0uHzb4gJV5luAnDl+A=";
    })
    .fromBunLock
    ./bun.lock;
in
  pkgs.mkShell {
    inherit (prisma) env;
    packages = with pkgs; [
      bun
      nodejs-slim
      flyctl
    ];
  }
