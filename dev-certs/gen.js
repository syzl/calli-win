var fs = require("fs");
var selfsigned = require("selfsigned");

const SITE_PATTERN = "*.de.v";

var attrs = [
  { name: "commonName", value: SITE_PATTERN },
  { name: "countryName", value: "cn" },
  { name: "localityName", value: "lc" },
  { name: "stateOrProvinceName", value: "sd" },
  { name: "organizationName", value: "c.a.l.l.i" },
  { name: "organizationalUnitName", value: "ooooo" }
  
  // 添加 emailAddress, 会导致 traefik 使用无效
  // { name: "emailAddress", value: "xxx@ccc.com" }

];
var opts = {
  days: 3650,
  keySize: 2048,
  algorithm: "sha256",
  // 前两个为默认的 extension 配置
  extensions: [
    {
      name: "basicConstraints",
      cA: true    // 非 cA, 则 android 无法导入
    },
    {
      name: "keyUsage",
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    },
    {
      name: "subjectAltName",
      altNames: [
        {
          type: 2,
          value: SITE_PATTERN
        }
      ]
    }
  ]
};
var pems = selfsigned.generate(attrs, opts);

const { public, private, cert, fingerprint } = pems;

fs.writeFileSync("dev.pub", public);
fs.writeFileSync("dev.key", private);
fs.writeFileSync("dev.crt", cert);
fs.writeFileSync("dev.fingerprint", fingerprint);