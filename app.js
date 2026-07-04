// Visit Route Map - Final v7.2 (Fixed: PDF table columns + Show Route zoom fit)
// ================================================================================================
// FIX: Use L.divIcon markers for interactive (visible numbers) + manual canvas draw for export

let map = null;
let markers = [];
let routeLines = [];
let routeLabels = [];
let visitData = [];
let useRealRoute = true;
let currentRouteId = null;
let isViewerMode = false;
let sidebarVisible = true;
// Default logo shown automatically until the creator uploads a different one
const DEFAULT_LOGO_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArAAAAFSCAYAAAAKIOyiAAAACXBIWXMAABcRAAAXEQHKJvM/AAAgAElEQVR4nO3dsW7bSBc3/L9ePOUHOG+dwtorsJ4rMFOljLeygRRWAAME0kgLpLEbM03SGIjUGCAQIHRhIKlWLl2FvoKVr2Dlwu33RBfwQV8xh4msiBQpDmeG5P8HGLuxJM5YEsnD4ZkzncViASIiIiKiuviP7Q4QEbVVx/e7ALoFXjJbhOGsks4QEdVIhyOwRETV6fi+BxWkdgF48ut9DZu+A/ADwBTADMB0EYZTDdslInIeA1hqtC1GuJpiugjDH7Y70TbyffMA9OS/exa6cQcgBhAvwjC20L5WHd8PbPfBgORC5KcmfHZEVWIAS8ad3T56UCf4Z0u/jgFMP7x8rjXokpPfuc5t1swD1OhcDHWCnPIWtF4d3+8B6MNewLrJDYAJgEkdL2o6vt/2k9Q9ZIQdsh/X8XMk0o0BLBkhQesQwKsNT70HMAIw0RHMMoBd6wHqRDhZhOHEcl9qaSloPQCwa7c3hdwAiOr0uTOAXesevy5KmDZCrcQAlip1dvvYBRCheM7fA4Dhh5fPS51oGcBuNIc6EUa8ZZmt4/vPoALWIdwcaS3iAWq/HLk+mscAdqPks4x4d4XahAEsVebs9vEA6sC6U2IzVx9ePu9v+2IGsIU8AAhQ01vNVZG81iHUiGuZ77KLkguYwNXghwFsITdQFyWx7Y4QVY0BLFXi7PaxD+CLps1tHcQygN3KHCqgGdnuiE0SuAYAju32xJj3cHBElgHsVu6g9uHYdkeIqsIAlrQ7u33sAfhH82bHH14+HxZ9EQPYUh4A9Nt2EpRUgRHaE7guc+7ihQFsKVcAhq5dlBDp8H9sd4Ca5ez28RnULUndBjIRjMzZBfC94/sTCeoaTy54Zmhn8AqoFIlPHd+PZaIa1dsxgFnH9w9sd4RIN67E5RAJ/jz8qiEJ+f8k724OVUolqRk4BRDrLj1V0hDVzcqO0M6arra9AjDt+P5BU2c8y2IDEepVUaBK+wD+6fj++0UYBrY7Q6XsAPi74/scjaVGYQqBZRK0HsjPphJTaX7WebQZzMrfMkO1E13efHj5PMr7ZKYQaPdmEYaR7U7oIiPLAYCB5a647A7Aga3AhykEWt1DfZYz2x0hKospBJac3T4+O7t9DKACvi/YPniFvPYLgNnZ7WMggaQNfVQ/S7tf8fYp25eO70e2O6GD3CKfgsHrJvtQt6GZUlB/e1B3U/hZUu0xgLXg7PZxCBW4nkNvwLcj25xJG6aZyLPatxigk3Jc9yC24/tDqImGTBnIZwcqpaBvuyNU2g4A5jhT7TGANejs9rF7dvsYA/iEakcqdwB8Ort9jGUhAVOKLlawLc9QO5SulkFsx/efSb8/2e5LTX2RtByqNwaxVHsMYA2RGfRTmAvyIG1NTczel9JZpvCg64bjju87U25pE8l3jdHeCgO6nNfx4oV+wyCWao0BrAFS1P877KziswPgu/ShSryt306DOtxWlpP0DPVfAtYVtRyBp9/sAIjaUiaPmoUBbMU0r0hVxhcDQSy108jlURzpW4zmLQNrG4PYZtiDKiFHVCsMYCskt+5dCF4TX85uH1nQmnRzdhSHwWvlGMQ2wyuZ2EhUGwxgKyKTp6pYkaqsyHC+KrXDHlQ9VWcweDXmuA5pJLRR0PH9ru1OEOXFALY6E7h54txBNbeLnBt9I+MGrqQSMHg17guXK629HQC1mZRJxAC2ArJAgcuTRfakjzo5EbiQddZPgDKKFIPBq2mRKxcwtLVXsqwykfMYwGomqQN1yCUaGq4RS+2wb/MEKHm4rt79aDpnc6GpkMB2B4jyYACrX4B6nDx3wAMVVSOw2HYEt+9+pJkDuMv4qYs9ODAKT6VYvQglyus/tjvQJDKiWaci6cdnt4/Bh5fPZ7Y7Qo2y3/F9bxGGsclGZYWoVybb3NI9VIpDDGC2CMNpnhfJyGYPaiW65L8uXiwfd3x/sghDFyexUj4BuOIhOY4BrF592x3YwhD1SHlw3ftFGAamG5WRki7UycYDsGu6Dyn6UAGaEfI+nJtqbws3UKkNk0UY/thmA/K6GEvvq0ycSn5cCmajju/3FmE4s92RvBZh2DHd5tJFSXJB4sGNz3FfPr9cF1dENjCA1atvuwNb6IMBbG0tjXJGwM/Z90PYvxNw3PH94bbBWhESBERVt7OFB6jb6VFV74OMck4AQEpZBXDjIiapduLZ7YbbVi5KRsDPi5IhzC47vs4Q9TynUUswB1YTWbTAhRNHUTtc3KA5FmE4XYRhH8AfAK4sd8fU9yqCW/veA4A3izDsLsJwZCKIB4BFGEaLMOwCeCN9sG2fpbWKW4ThZBGGHoAXsPs58rMjpzGA1afOO7tnuwOk1yIMZxLI/gk1QciGyvcJCZBcyXud41fgGtnqxFIg+xfsffYJViXY0iIMY/kcx5a6sMMLEHIZA1h96lz/0LPdAaqG3GLuQU0cMu1VlcGLbNuVGe83AKwGrqsWYTiC+uxtVjFgtZOSFmE4hBpVt8Gz1C7RRgxg9bGdr1RGHcsOUU4ykcaDnSDWq3DbQ9hPHZgD+HMRhgemUgWKkJF4D8B7i93gCGxJcmFkI4jlCCw5iwGsBme3j3UefQXwM4eXGkqCqz7M31L2qtiorLZlu+rAPYBeHcpFSYWMFzD3+c+hcrD/kFQWKkmCWNPpBLuyrxE5hwGsHhxhIOdJSZzAcLNVXdwFFW03rxsAXs3KRMVQFxRVBrFzqNHe7iIM+3V6f+pA0glM30mp/QANNRMDWD2asIN7tjtA1ZO8SJM5kdpTa2REyGaZsCtXUwY2kYsYD/qD2OXANajje1MjpsseNuH8Rg3EAFYPjsBSnRid+FTBLchA8/aKuKr7LXHNQSwDV8NkJN3kRSgDWHISA1iilpGcTZP1Jbu6NmR59PWm7sFrYimI3RYDV7tMXoR2DbZFlBsDWKojLm9YnsmJR12N2wo0bquIezRsVSIJYv8q+DIGrg4wPHGQVWrISQxg9eBB3GwaBd/v8moXwErdVxujr3MAtcx53URyom9yPJWBq3ts1vclso4BrB5NGBGMS76eeVL1UsfvbN9Wuw2fTd9Hej4sA1d3xaYaYiktchEDWD14UKdaqWkgYnr2NQCM61DntQz5Lqy+tw9Qy+I+Y+DqrJnBtroG2yLKhQGsBh9ePq/jaNYTH14+j233gYwzVU/SK7uBju/3YH7VrQfYrzdrhBTJv8OvwNWpZXFprZntDhDZ9B/bHWiQe9Q32d3GEqNkX51G1foW2hy2bOSx6akSRNQgHIHVJ7bdgRJiDdtgLdz6qdNnZnpN9rumpw6sYvBKRHXCAFafOp/sYg3bqOvoc5uZ+sxmZV5sKX0gMNweUVFd2x0gsokBrCaSQ2qyOLwu8w8vn9c5+KYtSEkqU2YlX29j9DU23CZRUV2DbbUplYZqggGsXpHtDmwhKruBs9tHr3w3yDDPdgcKMB3ABobbI9qGZ6ohWfSCyCkMYPWKbHdgCzqWJOxq2AaZ5dnuQB4yUmwyPeWBo69UE/u2O0BkEwNYjT68fD4DcGW7HwVcSZ/L4iIG9WNyVDMu8VpPUx/yMrnGPNFWOr5vcv9llRpyEgNY/QKkr2rjmkDTdhjA1kjH9/swOymqTP6c6e9WZLg9om2YXNSD+a/kJAawmsmIZh1Gcd5rGn0FeCurboyuaFUyf87T1Y8c7lpW95VqqOP7Hswec2ODbRHlxgC2Ah9ePg/g9m2Xe+ljaZzAVS8d3x/CbE5p2f3A5Agsq3FQHZgeIJkZbo8oFwaw1TmAm6kEc+hd1cj0DHHaktRTDQw3u/Xoq0zg2tHYl00YwJLTOr4fwHzN7dhwe0S5MICtiNyedzG46394+VxnSRQX/0ZaIcFgDLMBIVDu5Gdy9PWBK1GRyyR3/dxws9wvyFkMYCskixu8sd2PJW90LlpwdvtoY4UkKkhGXqcwH7wC9QlgWeeSnCXB6xcLTccW2iTKhQFsxT68fB7BjSD2jfRFp77m7ZFmUm4nhp0LjbKjNyZXC2MAS07q+P4IdoJXgGk15LD/2O5AG3x4+Tw6u32cQR0MTI+CzQEcyGiwbv0KtkkadHy/CzXZ45XFbpQ9+ZkcgY0NtkW0kVQbiGDvLtd8EYYMYMlZDGAN+fDyeSy33COYK4FyB5XzOtO94bPbxz7s3JIGOCs2lYy4HgA4tt0XlJ8tbXIEdmawLaJUki7Qh/3yhAxeyWkMYA2SQNI7u30cQs0GryoAnAMIPrx8XmW5lX6F285URUBeRzLK2oUaqexBBa62LipW3dVp8ked+krNIfnpz6DqHfdg947JqjrUM6cWYwBrwYeXz0dnt48RVEH5IfQFHXOog87ow8vnlRVkl9qvtkcHXHPe8X3TM4RdFmnYhqnv2IOhdshhHd9f2O6DQ+5KLkBCVDkGsJZIgBmc3T6OoEbODrD91fcN1O2eSZWB65LAQBtUXw+LMIxsd6KAme0OEDkmst0Bok1aF8Ce3T52oW67evKrH1AzkKeGgr8npM0IQHR2+7h8Kym5tdTDrxHaOX7Nlo7l/2OT/T67fTwAR18pW2C7A0S0tbpdgFJLtSKAlaC1Lz+pMzrPbh/voW6/Ryb6tUoC0QkcTZ6XAJt5UZTlnic/olrr2+4AUR6NDmAl4Boi/+olewC+yCSrYUWlp+psCC5cQNmGtjtARFu7W4RhbLsTRHk0diEDKVkVY7ul9/YAfD+7fZzI6G3ryfvJSUqUZcyTH1FtzcHRV6qRRgawS8HrXslNvQIwPbt9DMr2qc5kJDuy3Q9y2gOY+0pUZwHLyVGdNC6AlWArhr7SVDsAzs9uH2cygamNRih/MUDNdrAIQ+OTIIlIi5tFGHJ+A9VK4wJYVLdc6y6Av89uH+M2pRVIPrALqzqRu96wZiRRbd2DqQNUQ40KYGV506pLPO0D+Pfs9jGQ0d7Gkvfzk+1+kNPes+oAUW3NwbsnVFONCmBhNgfvHCo/tpFpBRK8frHdD3La1SIMgwq3f1/htpexrjG10RyAx7xXqqvGBLASSJou8dTItAIGr5TDeBGG/Yrb4KgQUTWS4JWpP1RbjQlgoZZitaUxaQUMXimHN4swbFS9147ve7b7QGQIg1dqhCYFsJ7tDqDmaQVnt48jMHildHMA/zWY8xobagdQy0sTNd09gC6DV2qCJq3E5coKUUlawR2A/oeXz2eW+7ORpD9MwFJZlO4GQL/Bkz16tjtAVLFx0+6cULs1YgTW0fzTWqQVSJmsKRi80noPAP5chKGNmcqxwbY8g20RmZTswwxeqVEaEcDC7dt/5wBmklvqjLPbR+/s9jGGKpNVRd1cqrc5gPcAeoswnFjqg8mAea/j+85eaBJtaQy7+zBRZZqSQjCz3YENdgB8kSVpRwCiDy+fW7kVK6PVAeq7OMGd7Q403APUssEj2+kCizCcdnzfZJMeVCoNUd1dgUvDUsM1IoD98PL57Oz20XY38tiFGvEMzm4fJwBGH14+N5JMLxPLhmDNS/rdHCpwmzg4UnMPc+ktB2AAS/XGwJVaoxEBrHiAOxO5NtmBGgE9Prt9fIA6aUa6g9mz28ce1BKBNmrkkvvuoEZaXQ7aTOZn17J6CLXePdRdk8j2XRMik5oUwMao523xXQADAIOz28c51N8xlf/OilQxOLt99KBmU3vyw9xWytKF2YlS24hhbr/e6fj+geMBPRGgqoLEUHdNZna7QmRHkwLYCeoZwC7bAfBKfs4BQFIjHpCd59sDg1UqbhcqrSSw3I8sseH2+mAaAbkjOfZP5b8xa7gSKZ3FYmG7D9qc3T7OwFvlTXf34eVzL++TO74fQC4GKvYX1ElGhwnMXpD84fIoTsf3ZzC7Xzv9frRNx/dNnaReGGonjynTAYiyNWkEFlAjSVxJimyYLsIw1rGhju8PYfZ7PILb+Z8xzN5dGcoPtYiu/ZeIzGhKHVgAwIeXzyOwzBLVnCzV+mCwyVcd3/cMtleU6Vv6fdaEJSJyW6MCWNGHKgtEVGemRwAjw+0VERtubwdu5wUTEbVe4wJYmbXvgUEs1ZjMhDd5N2FX8oWdI7mAN4abHXR8v2u4TSIiyqlxASwASD1VD2ZvwxLpFhhub+hw0GajMkBkoU1rOr4fdHx/5PB3gIjop0YGsMDPILYHtTIJUe3IpBKT31+Xb51PYP6uyn7H912e3KaNBK3nUDWp/+34fsRAlohc1tgAFgA+vHz+48PL532o8ij3lrtDtI3AcHvHLk7okjQCK6OwLZnQFa38+xgMZInIYY0OYBMfXj6PP7x83oOq1cncWKoNqUc6NtzsyHB7edno1w4avrCBlG3bT3mYgSwROakVAWziw8vnI6i0AtMTQojKCGD2wmtPghqnyApENsrk7Xd839WgvpSO7/eQb5Q/CWQnLo7QE1H7tCqABVSVgg8vnx9ApRVwkhc5T26fmw6gAkdvnUeW2h10fL9vqe1KyOcbodiqb68AfO/4fsxAlohsal0Am5C0gi6A92BaAblvBLMXXDtwMJXAwiIPy740LIiNAOxt+dp9MJAlIotaG8AmPrx8HoBpBeQ4GYUNDDd7LLeYXRNYbLsRQWzH9yOo0dSyGMgSkRWtD2ABphXUzNR2B2yR0UfT1TQ4Cvu7WgexErwea95sEshO6/zeEFF9MIBd8uHl8xhqNPa95a5Quh+2O2CZ6clV+44GJLYnmX1xdeWyNB3ff1ZR8LpsD+q9mTn6vSGihmAAu0JqxwYA/oCdGc9EqWRxA9Pfy5FrE7osLLW7zrnMynfqvVlHSmDFqDZ4XbYLBrJEVCEGsCkkrcAD8CeYVkBuMT366OoKXbZHYQGVRzp1Of9TVhObYvsJW2XsAmjFamZEZBYD2A0+vHw+AdMKyCFSD9X0EskD1wrZy/vgwn65C5X/6dSqXZIyMAHwN4qVytJpDjcuNIioYf5juwOrjsbjHtQVuwcVOCYH3jnUKMIEwOTrYDAz1acPL5//ABCc3T5GUKVn0latITIlgLnbwYkIar90yQhAHyqItO0YwIEsejCSyhFWyEIUAewFrolAVpMjItLKmRHYo/HYOxqPYwD/ADiHChKXD7478rtPAP49Go9HR+Ox0dEOphWQKyQoMD36uC+3o50hQWLfdj+W7EAdv2Yd3ze6GISMuPY7vj+DOk7aDl7vF2HoXBULImoG6wHs0Xj87Gg8HgH4jmIjmwMAs6PxuF9JxzIwrYAcMYL5RThcnNAVw719MQlk/yepBZUF/h3f78mo7wzAF7gxGg24dWFBRA1jNYVARlBjbD+5YAfAFwlig6+DQaynZ5sxrYBsW4ThDynl9Mlgs7tQOY2BwTY3WoRhIBOpXNwPj6EWhZhDHe9iALHk8BYmFxCe/BzAnYB12V/b/n1ERHl0FouFlYY1BK/rXAEYfh0MjOeend0+HkCNiLl4MmmS91LmLBcJ8M4r680vL2Qk0Di5ZWzyezcH0HMtt1ECuxns3zov4g6qtnES7M3kJ9EDkIx4ewC6cP8Yc7cIQ0/Xxjq+b+QktQjDjol2iEgPmykEEfSXdTmGSiswPuuVaQVkUWC4vR24uULXD7g3yWyTfahSXOfy8wUqnSr5+bT02D7cD17nYNksIjLASgB7NB4fQM863OvsAPh0NB5Pj8Zjr6I21uIiCGSDLK1q+vv2ysXap3Lb+o3tfrSYZ7P6AhG1h60RWBOjN3sAvh+Nx5HFagVvYH6SDbVTYKHNyEKbG0lAzyDWvDfMeyUiU4wHsDL6avI2mM20gggqZ21sum1qF0tLzO5KjrFzJIg1vdhDm43lPSciMsLGCKyN/CjbaQVDAP8F0wqoWn0LbQ5dK6uVWIRhHwxiTbhahCFX2yIio2wEsJ6FNhM20wqmTCugKklVANMBm5MTuhIMYit3I+8xEZFRNgJYF2bRMq2AmmoI8xdIxy5O6EpIgPWX7X400D24WAERWWI0gDV9+36D5bSCnsmGmVZQCmc4Z5AZ4DZGRJ0dhQUAWdKUE7v0uQMrDhCRRdaXknXAHoB/jsbjEdMKaoGznDezscTsXsf3nc6DlElG/wX3tbKuFmHI4JWIrGIA+8sAKq2gb7phphWQThJY2AgmA1cndCWkzFMP6vY3FTdmzisRucBoAPt1MIhNtreFHQBfjsbjmGkFVGcy2vhguNkd2KlHW8giDGeLMOyBF4xFvWG1ASJyhY0RWNMn1W3sg2kFVH82go1Bx/eNXvxtS4KxF6jHMcmmBwD/ZZ1XInKJjQA2ttDmtphWQLW1CMMJ7IzmOz2ha5ksAMHR2HQ3AHpcYYuIXGMjgJ1YaLMMphVQnQUW2tzv+H7fQrtbWYThj6XRWObGKnMAfy7C8ICTtYjIRcYD2K+DwQT1vGXHtAKqHRlhvLHQ9Mj1CV2rFmEYS25s2/ezGwBdGcEnInKSrSoEgaV2dWBaAdWNjVzYHUvtlia5nl0A79GuQPYewAuOuhJRHVgJYL8OBhHqfUucaQVUG7LErI2LnvOO73cttFuapBUEaEcg+wBVYaAnI/ZERM6zWQf2APU/KTCtgOoigJ3vSWShTW2SQHYRhs+g9rUm5cjeQQWuXVYYIKK6sRbAfh0MfgDw0Izgi2kF5DSLS8zud3z/wEK72i3CMJIc2f9C7W91PHbNAVxBpQp4DFyJqK46i8XCagfkFnwEtaRrE9wB6H8dDGamGz67fWzKezmHWjI2BvBD/h8fXj6Pi26o4/sBgHN9XUv1wvXbrzKpagpg13DTD1ClmBqXVynB+QHUxbjp97WIG6gKMJO6fQ4d3zdyklqEYcdEO0Skh/UAFgDk9nsANZLZFO8BjGSk2aiz28ch1Pu5Y7rtLc2hgtUJgOmHl8+11Zzs+L4HFVxULZJcU6cZfD9WTZpeS1QWcPCgAtoe7O5/D/i1T8V1C1qXyUVo5STnmYhqwokANtHA0dgHAEMpHWbU2e3jM6hbxsem285pDhkR+vDyOcv1UONIQLv6U0VQ+wBgBhWwTgFM63AxRURUhlMBbOJoPK7bCOImNtMKPKhA1pWLgjsAkeTuErWOjIIDKqBNJn925SfNTH6AX2k1P5o+qk1ElMbJABb4mVbg8gjiNtqcVnAFFbjGltonIiKihnA2gE0cjcce3BpBLKttaQV3APofXj6fGWyTiIiIGsz5ADbBtAJ9DKUVPEAFrnGFbRAREVEL1SaABZhWoFuFaQXvP7x8HmjeJhERERGAmgWwCaYV6KM5reAeatSVE0uIiIioMrUMYBNH43EAYAimFZSmIa1g/OHl86G+HhERERGtV+sAFgCOxuMuVOD1ynJXdKpTWsEcwJBlsYiIiMiU2gewCUkriOD2co5F1CGtYA7AY8oAERERmdSYADbBtAJ9NqQV3AM4YHksIiIiMq1xASzwM60gArBvtydauZRWcA818lrb9dWJiIiovhoZwCakduwn2/3QyIW0gh4YvBIREZFFjQ5gAeBoPO4BiNGclALAYloBERERkW2ND2CBnwsgxGhO3diEtbQCIgDo+H4XQBcAFmEY2+wLEbmr4/s9AM8A/FiEISf+lsD3UmlFAAs0Ooi1llZA7dbx/RGAwdKv5gC8Nh9Qieipju8/AzDB0zkp91DHCg6+FJDyXt4BOGjje9maABZodBALMK0gVcf3+5BRwi1NAfwAMHX1INHxfQ+At+6xRRgGFbQXADhf89AcQG8RhjPdbVL9yQnYk59kFGn5eHwn/40BxBzVd4/s++us/bw6vh9j/YTq+0UY9vT1rPk6vj/F+vjlbhGGnuHuWNeqABZofBALMK3gNxkH0G3cQ1W4iFwKZjMCSizCsFNBezOk11x+X0XQTPUlF1h9FF+y+gFqfxu5tL+1Wcf304KG3/Z7STH6N2Nz/+Udm3xkH/qe8ZQ/2jZw8H9sd8A0Cew8qECkic4BTI/G4wPbHWmoPajKFrOO77f5PW7KgiFUoY7vd+UC8juKB6+A+p6dg/tbXXU3PP7MRCdaomu7A6b9x0QjUgmgC3XLaNUMwOzrYBCb6AugglhZuWuGZlUnSOwC+PtoPGZaQXV2APzd8f03izCMbHfGggcwiKUMkrozgp5jbLK/XS3CsK9he2TGzHYHXCNzB9bFQlHJc8msxGtrqZIAVhYSOJCfXLduj8ZjQI2KxgCir4NBpbcVloLYf6psx7J9AP8ejcdMK6jOl47vo4VBbIT0HNjIaE/IOWsm+OlyLPtbv4Jtk2aLMJx1fP8O6TmwseEuuaCH9e9HnPWiRRjGHd+/R3oO7Kx81+pFawrB0XjsHY3HMVTOyycUzzvcgzro/XM0Hk+PxuO+zv6tkiD5ryrbcATTCqo1kskprSG5buOVX88B9Nt4IKVfKgxeE8cd348q3D7pdYBfk/MS90iZdEqZPPye/ngH9R63jpZJXDKSGaCapVsfAARfB4Oogm0DAI7G4wmAV1Vt3zGtSyvYMInrAdm3XrrId6t8vAjDYaGOaWR6EtdSu12wDiwJSRv4kvPpD1CjTrOl3/WgTtJ50g7+XIQhywcaVmQS18rrWLsUmeej3JNf+V4qpVIIZEZ/gGqvtncBfJHR2KoCrz6amw+7imkFT0WbDhoSpEXIvkDrA7AWwNoio60zy90gB8h+Msrx1DsAQdoFj9zNGMpP1jE56vh+l9UJ6qHNgZZufC+VrVMIZGLWFNUGr8v2UdFtcAni+rq36zimFeS0CMOZ1Ni7yXjajlwVE7VVgM2DAO8XYehljdYvwvCHXFR6yK4Ww9FXohbbagRWRkN1zS4tYgdqdv37r4NBoHPDXweDiczaryINwlWsVlDMENmpJslFXSoZpUomOPbw+z50L9uYVHF7VNofYv1EgmQS5WhTHus2CydkFECPkvZk9K2P9RNA51BBS7RNusJSLdIenk6EmEP93ZPlyXh5CrZnPGdWZGKfXPykXUymFvRf+j55UH/XunSXO6jvVFTVyI30Y1OZrEIVOxZhOJXPbIan+54gEoEAACAASURBVMkV1AjuLGffnuHpPrf6Hj1A9jmo70CpEd2q9vG8+5x8l4by3F1svrXfXXr+6gShO6i7T1u/LxkLyazdRwr+nX2s73fuY9k6UrLNQ/qEq9zfmTV/f3ftEwFvzfEkWu5/0fcyo0/Je5f29211zMjbP3l/k/d4dX+8w6/jfOZ3rnAAK8Fr3hynqpwfjcfdr4NBX/N2h2h2VYI0SVrBC5PlzOpGZtRmlY/qpr1WThIBNp/k9+TnWNoKdFQ4yNl+0vYgR3kwDyk5t9LOOmnPj6HqfAbIvm28A9X/4yLllHKkgOxAXZi8kj4cyEE7rb9JnwF1Elj7fej4flzg5Bkg/eIoXv2FnOQD5Lvg3pefgcwIr2Ki3ab0mattvseLMPwhJ7vv2C5wzZOKsCs/r6AmZI6wxcIJBvZxDxn7nPy9EXLO55DnB8i+i5p8d4KO7w+3vKjuIz1Iitb83kP239mFGkDL+juLHMsAPPm+9LF53sNv35mMi4Q+iu2ny2I8TdFK21bae/lEgePG6jEjNeVnRWb/pP0I2e9v0vaw4/sHWQF0oRQCR4LXxPHReBzo3KBUJbjSuc2amdnuQA0UHoWQq9Ipihdy34Uq0xWXqXIgB42i7X+RfpvwTJZIPEf+uzq5ZqLLSMMU+e+s7AKIC/ztWTmfudJz5LNNOxk/LJ84Or7/rOP7E6iAbpu7RfsAphWku2T9rXOUyA+Xv///LsIwd+C99LkX+U5BnnsO9R3I/R5JkG1zH+9BHb+LBK8x8qcA7kLV4e1v0T1tlj7XIpOuNx7Llj6/cxSvb70D4Nz1yhhycb7NcWMfwHe5sNPRft73NzkWd9OekDuAlZzXUn9ABc4rKLUVaN5eXdwwhSCbHPSzliD+LbhdmpVdJt1mH2pH3vYE933L9k2VB4uw3dLOxxKcryUHvhjF//Yd5D/WRRmP5Q3a+hmP/eyH/D1FT97r7GDDiaEICSqyTkqll4Et8nrpT7yhT5vsIWcQK/v437C7j8cF24+x3T5newArhuZj2dLnV3ZhluOyQV5VJLjOuqOUx6BEkL6/ZfuZx+JcAaxUG5jAzVn6IwmutZAgLmuyTlNFtjtQA5sOTk9udUhwpeuAvwfzk1Z2YKa+YJnjSlaQGJXYdq7XSWCVdtdmN+coXj/jsWiprRm2uAOQYgf6LtY3/Y2RpnY2WhpZ1LX6V2ZQ6dA+nvvvlZGwbYJXF5TZn9OOZbMtt7nOwLXJvPJ5b7OM8zo2gvRXaRfbeUdgA7i7bOQO9B8gdW/PdfOvg4Hp4Kg25LZthA0HgdVbvcj3PbqHyg+6g7rVmmW/4/tb34oVD0vtrRYXX8dEALtsDtWvK+R7T7x1v5TAIs+tsiLvf5oo47HMz0tOdmnBxNWakcd125tDLSrxJ4AX8vMnNqdDHWsaYe9mPPZgeGGLPAMty5/5w4bnpp5fKtzHgxzb3IoEAnlGwoq8R7Ykx7LkWLGJt+6Xctxe9/p7AO/xa596AbXw0ab3o+wxWhs5vuT5vIucEwZZd75yuocaKLxBdqWRxNqLgo2TuGSRAlOlsra1dzQeD78OBlquDKQiQZvWem9z8Lpu5ueTx7F+JvGq1WBhiOzvzw2A4erJvbN5/fig4/sbZ2eu8SDtPfms5YQ2QXoQZSKFAFAn9gArM08lSBgh/eIh7X3adBLJev8DFNj3ZYnHtOPFpguAfsZjUUpbSbWUOdTkirTj3kRGS2Kkv0/J7fYyskacZiW3nVuOi5Z7qM88XvO6EdL3gVcd319X+quqfXwok4K2GW2/h/reTOW74uHpZ7Bpv7iHmsS4/Jo875FJD1ATEePlX+Y4lnUzttmHWkEUUEHcMGXyUIxfE/3S4iJv5d9DPD2Ofk953RV+3+dTJzDltCkmeo+VFJ+lyWxZgW+A7VZSS9snPGRffPawJk7JU4UgKNQ9e4Kj8TjSWJh/AvcDd11i2x2waN3Mz22sHij6Gc9NnUG/CMNIJjTFWL8z78i2i1ys3QPw1p0QpbLCAX4dvG2YQ/Xvt4O19LkvB7hcQeWGSVHA5vd/ArX/F/lejKCWz1610/H9fsYs6LX9wMrkrTWvmWBNoLFKSlEdIP2k6aH8/m/qImeTrOAsax9IAr0Y6cFPH7+/T/2M9kzv48kyzk9O8mu+Q1kXVHdS7/o3sp1enjtRFavkWCavHUOVe9r4vi/CcCijm+uOEbsrz11NLUvb7EznaoYS0Gcdw9ZWZ5D3Nuj4/gzp6TH7Hd/vFSzL91faeyv74DCjvbUyUwhk9FXHyd2EHegduo80bst1bR6B1WG8vCNvmNTysKn8k2wr67tc9Lb+2gP+Unsz5Lt1VJV+jgNhVGB7WSOCed7/Hyj+HkdIvz28dltysk0bcUg9icrCGr28t+Z1nhQdl3XRcrBhH/iB7ID0yWfo6D6eeRyXgCatz/M8beYtXVehyo5lizAc5glel7h+3sz6PG82lRaTx7PSkPoF+nKf470t/H5uGoENim7QsiE09fnrYDA9Go/ncHPimk73XE62lKtFGK6eiLIOHLkOkDJKE2D9CafQRWXOW5HTotvVKE//YuSfxeplPBbk2YDUH83Z3M/nT7B+dOpVRy15Olv5fT9jk9GmNju/Fj/wln79A+qzTF38oAIzWB7o2JCTd5Un2JfR6husD4R3VtIIXNvH84yEdTMeK72Agwk5+zjDlt/Hzq9FL3p4eiE8le1Olr5LZW/vVy3rOxrk3EaA9BH3rIGCVRs/t6LHXCBjBPZoPO6iPqOviR3NZbVcv8LSIbbdgZqaQ61w01/zWDfjdUW+U3HaAxXMdHX+5KVJlSedrMBldQQvK81h3eSt5dd6cnvvH6igfn/p55X87nvH92eG6nbOMh7T/T3dpp24wHay9s9uyv8X2caqOO2BCvZxL+OxJp3rZkVfIBN1RwD+B3Ube4Cn+9UAKkXoX6nZa+p7XUY35fcPeW/9S7CeNsnKenyYlUKg83a8SUVvvWRx/QpLhzb8jTo9QCW+9zJWXummvbjgjOys57qSd1grBXO2ttl22sF+9Xjaz9hUlPaABKR5i4EnRfKrDk5mGY/tGDrZZ+0PswLbyXpuN+X/n6jpPj4z2JZTtljUYV+e36+mR9qkHSNmBbfj7OBGVgDrmeqEZmWLfC+LNW7LVW0PYK+gAtLln01lUrZaX5taIW0UdrUmbD/leamTtyRndpuaozqPievEGx6v62BIa1R5YVcDExSvrpAsa90GM9sdSLM2gJWFC1wol7GVo/FYyyisLC3baG34GzeIFmEYLP8gOz9oFzwh15aB0cAJ0idzDZf6kHZ8zUpD2JRb+QBVpmaMcnVtC5GLuayLvuOyq37V5JZtbWmo61lLOetF30PtU1fIV7O0abq2O5AmbQTWM9mJCug82DX5C+tqgWqrZPZl1kzW8w0n5NSLgoIn4qznzgpsh37xqty45K6m3bJPLqz7KY/PkV40P2vWO6BK1HQXYXggs6m9RRg+A/AGZgLZqOTjqWTk+R/JPfRSnpZ1IV5kn0vb/mobWft41jZWmdzHs24FdzW3VRf9jMfuAfwhFT+GizDsL8KwB+APqIDWdWnnsKK5q2nfUevxQ1oAW/erXU/jtpzN/9BgZrsDDgs2PJ41GpZ1Mu3naXzDJJ85UxgyxRmP5Ro9L7lCVdp3Y0dyWPspj2fNBPcy2suqrxjBTHAyQnagvL/NOuoSuCev24eanBavmZw2y9jM6nOzZD03VwCbtz0L+3jpPjdQWqyT1KaerT4gZeyGUKtyuWyW9kDeyZ0bSv1Zv3ubFsB2TXaiAjqT32cat+WaJgfnpWQsL5h4lTHSEme8rp/zdmqQ8ViTZgxXIevAurspkFqa1LGVDZO5Rtii9iuyj2nRhv5Uvp9LG5tSHI47vj/Je3EgJ88Yv79f+1CT02bJviTvedqI0J5sa1N7Q2TXdp0t/TvO2NRxzjstQcZjVezjWfvFfp6R47KpIA5KS+XJU1bMegC3QZzxWJBzPwwyHrN+HmpqAKszf3emcVuucX0HtK2/4fFo3S83FNPegVriM/XgIVfHWTNi17ZLipx4bjKekgRS3dUH5L2fofwxJHUUNuX39w2YSDPC5tuKrwDMOr4fpAVDHd/vSeWEv5Fdh/vHSlAZZTw3ygoqJXgLsl6//I8cBfOjkvu49uBA9ouslLjJhveoh+ZNbDaSJ56TzgpKQHY+/i42XHDKhX7WcdB6AJtnKVmiVpLlBa+QPtt0t+P7ycSvVQHSl+/cgzqJj6Amkc2AnyNOQ2xYz71FKyuVMUL27PtXUKPoD/h1kaqzruEE2aOtqzaNXmYFt0NkBF+mJkBJIfIDqPq0WXagatWed3z/Hk/vBHWRc8lg/H6BGUG9F2nLs/4jy4VGycWCvDdDZM8on2P95xOgun28quBghPRKFjsAYunzZOk98qDe6ybOup9i/Wdx0PH9ZxtGYT3Nfdnr+P5wEYYj+Z54axbJyU32xxHSF4A5Xrpwm8jzn0EF0gGy98PMWtWmZC4lS0QIkH2VPlw30pIjBSE5if/b8f1Fx/cXUCNOm4IoVkDIIcf7n9jFr2LlOtvPmsy1ap7juXHGY+dy+/sJKc7e3/BarSToeVPgJXt4WjA+b/D6ZnXEWoLETRcCA6hANtnn/sHmwCxYd7KW71jWSL+L+3jWqBzwq8/L79F3NDN4BdIvDJNg3lt9oOP7XblDkHdlwFVZx6VPS9+TgYaLz013RXahLmj+J+0mCzlk7YdzOHIeYgBLlCHHSXEn4/ED6J2p+Z6jr4X0sf0tQh23FjcFU4mN+XbyeNa65J86vv9DJjjFHd+P8etkZHQ5bJk4VmX1gzdp67jL3ZA8Fy553WxYw72PGu3j8j3qV7X9Gsr6bPfwa0W7ZL+aAfgX5Worzwo81yvRTvJ5605NOHBh9BVgAEuUx6YZ1sfrrtSXDh46TuRXGSt/0Rpy8eGh+Ps/h4bbgxsmcy3LG+gG2Dx6tjyaaY0EmB70BndzZASvSw6gp/zhHTYEe0v7uI6/08g+LukJWRdDWVzKGS1NjhHvNzxt+S5N3jsEWaICz/XKNrZ0V0THZ/fGpUGUpgawjdrJyC45SW26ZZJWxmgKlde37ahQctLub/n6Vlt6/7Nu9S67A9DVOKFqU3Cae/JWiYDcSs1K+bt6UAFC2WPyHdTyzVGOdn9Ivc4yf/dYauluHGla+jtrs49LW0XfnwfUv0b8b+SioWhAP8eWZbRypJ4s07KKnoYLygcA/82z/5mUFsDWfTaszv57GrdFNSU7btbOv7cuD1Fe+2MRhh6AP5H/JDeHOsF0XTto1I28/wf4VYB89TN4gDqBvUiClm0XqlhjU85h3tFXAE+CpTwn3Duov8lavpq89wHURcRfKD4yeoNfn8usYNtDAP9F/mABUO/rH0Xfszru4/I3vkC+/o6hLiDqHhusJQH9n9gc4P38zFAuzugj3wXEXcma1D8twnC6CMMu1H6YN5B9gEpr0XlRr01aFQIn8htKmNnuQE0YmZ3sgCHS62gW2Sk9ZJeY25THOIEqVdOVbfXw9DP4If2Jt7hNE6HcZJ201/9/Gtt7kfL7PJ/BNOX1/0/exiUAyhuYeBmP5T4+SjA8w/pyNHkmb63b5gyqnnAAdfu6h1/fyxnUezVZCfjS3vv/t2j721iqEzta+v53ofq+vG/O8OtviMvm2slJ92BpdnXS9rJYY3su7+O/kT54Mlko+S4ln8cMqq/RyvuS9l2apfw+7fib9l5HMHssA/Dks0veB2/p4Rgr35GO7299TEru6kmVgD6evu/Jd2SyJmgs+l6uazvZD5O/cfn4ATzd/4oGrWX7V+g41VksFr/98mg89pBeHqQO/vo6GBQa2UhzNB7/gOFJEAbdfR0MPNudIKpSx/cPipYlkklQaXmk/zdvoCOBzL8pD18xNYSIaDtrUwi+Dgax4X7oFuvYyNF4/AzNDV4BvSuWETlHRin/LrKMqaSCpAWvDwVH6bIupLVcZBMRtVHWQgY30JRAbNj862CgK1ej6bfYda5YRuQUGf1MUgZ+K9qd8vwRso97UUZ7ffy6/daTttO2dediThkRUV1kBbAT1DOALZxTlsHTuC0nHY3HPY0BP5FLIjy9g5IU7f6y5QpQaSsyJYbIf1EY5XweERGtsSmATVtyzmWRxm15Grflqi7qX3WC6AmZiJFVC3Wbuw/9DekDebf5wMoSRETlpNaB/ToY/MD2xY5tedCVvyv5r1aLgRvS9DQJaqcZ9NaDfpM1Eazgko8HGvpDRNRqmxYyCEx0QqNA47bacpLxbHeASLctFjBI8wBVhzTa8Lxujm0lBet5x4OIqKTMAPbrYDBDfUZhH74OBpHG7bUlgG3DKDO10NICBi9Q/Dh2DxVsdnPW69w0AnuFnCtJERHRZmvrwC47Go+7UDmSrpeTeqE5feB/OrZVE39+HQx0Tn4jcpJUIvDkn135SQqHA1sWtJcKBn35Zw8qhWG5aH3dF4chInLKxgAWAI7G4yGAT9V3Z2tXXweDvq6N1eDv1U3r+0dERERUpU05sAAAWdWqbC5ZVR6Qf3nIvHRvz3We7Q4QERER5ZUrgBV9qLwwl8wBHEjFBC2OxuM+NteDbJrdo/G4LTm/REREVHO5A1gJEvvQW5qmrIMKivAHmrdXFwxgiYiIqBaKjMBCgkUP9oPYOYA3uiZtJVo6+po4lslrRERERE4rFMACP4PYHuylE8wBeJpLZiWVB7KWiWy6ewAMYImIiMh5hQNY4Gd9WA/mJ3bdA+hVkDYAqNQB10uFVSEZze7J50pERETktFxltLLI5J8I1QZ/cwCjr4NBUMXGj8ZjD8D3KrbtuDGAQOckOCIiIqKqlQ5ggZ+334fyozuQvYIKsmaatwvgZ9+naFfu6x2AYUUj2URERESV0hLAJiQY7EMFsmUCwjnUqO6o6tvaR+PxBMCrKttwyAPUxUBkuyNERERE29IawC47Go97UHmyB1CTvjaNzN4BiAHEuqsLpDkajwMA5ybacsB7qAsCpguQ0zq+34da4rWMKYDZIgxz32VYWWZ22WwRhlHJ/jin4/vJgMPqMfoe6v2bLMKQS0wTkZMqC2DXkVzTVVMbQZWUzPpiul0L7gD0OUGL6qLj+zGAfU2bmwOYAAgWYTjb0G6A9Re0d4sw9DT1xwlykTDC5oGF/xa5CCAiMuU/JhszNbK6iYwONz14fYDKc+UICrXZDoBjAMcd33+/CMPAcn+sk+A1z/HvgcErEbnKaADrAgleY9v9qFClFRuIauy84/vdRRj2bXdkGxkj07kD847vF7l4j3M+j4jIuK3qwNbVUvDa1HqvN1B1cgPbHSFy1LGkCrTVsMBzefeGiJzVmgBWcl5jNDN4vQfw4utgcMBcV7sOry+5mpn7zmUkso2OMx57D+AFgD+hRnUZwBKRs1qRQnA0Hg8BfLLdjwrMocpitXkJXNfEEsT2v71+G9vuTAM9AJhteE6eCWBDqBn4rSFVFtKspiEweCUipzU6gJW6tBGaWef1CmqSFstiOeLw+jICsCf//H54fXkDYPjt9duZtU41T7Qp31PKQwUABhlPO+74/nARhtx/lNh2B4iIimhsACsluyI0b4WtO6hR19h0w6cXJ88A4OO7zzzprzi8vhzh99uzrwB4h9eXwbfXbzlKbogEpcOO7wPZQWzlEzo7vt+F1LRdhGGlbZWhq29Lo7zTOl4cLH1ehfsvf/sPVm4gMqNxAayMugbIPnHV0RxqxDWy0fjpxckQ6n2doGW3Xjc5vL7sI/37tgPgkzxnyLQCowJkHwc8aAxgZeT3QLbrYeXiWQJqQF2ETqAWCphlbK+Ppws6dNc+EfDWTEyL5L/9HK/HmtdvXLxhZSGE39I25O+9g1oUYbSpDu+G/iSiZDsSbA6l/V2s1OvNWBDj59+29Jn1V/+Gju9n1hCW9gOsfNbyd99LX3nhSlSRRgWwR+PxAVRx7qaNuo6hRl2Nj2icXpx4UO9pcmv8+PTiBB/ffe6b7ouLJDDNU5ZoDyqt4AoqkK3d6FTdLMLwR8f376BvUYS1JAgayk+eSaL78vOp4/tjqABp3fehj3x9T7a3LJb/5l1pcPV5d/gVBD9R8O9N+jbo+P4VciwokdKfRAxglrHoxLI+1r9/dwCiju8fQP2NaX9DUkP4oOP7/WRSW84UlT2oz7cPwKvjaDSR6xoRwEp5rBEqPlFZcAc16mr8ltTpxUkX6j1dlz98LI8ftDmd4PD6MkDxpYiPARwwraAZcgRBmwygRlBrEeRI9YYIvy5oi/gtGNzCs47vT7ds/6eO70fIrsiwbAcq4O0B+AEVROdtfw9qFNcr1kMi2qTWZbSOxuNnR+PxCMA/aFbw+gDgz6+DgWcpeA2gbvtlTX7bBxAnebFtIxO2igaviSStYHp4felp6xQ9ISNllR0XZHTtb5QvzbeHlNFOl0gAF6Nc8LgD4G9577YRlWwfUN+JvMFrYgfqgj7eov39FpdtI6pMbQNYqes6Q/NyXd9DLUZgvIzN6cWJd3pxMoMKzPKclPcATE8vTlpzcD68vnx2eH0Zo/gJcJ0krSBi/dhKbCraX/biUOfF5asNZa6skouBCfTV0f6yZVBns473K2wfPPc19oOIUMMUgoanC/RtLEQg6QARtntPd6FGYocf332ONHbLOYfXlz2ok7juHGumFWiUM0cRKDmBaxGGU8nrXL2YuYH6nsyWftfF5pzWftk+VSjP3IJ7qP7/gLplvul4MkHGxDJD5lB9nkJVpShScjH5e4FfE8nStOYin8iU2gSwUl1gXamiunuAClxj0w3L7f8htr8VntgB8EUmfA2bmBd7eH1Z9WIYy9UK+t9ev2UpnvX6OUYq81yI3WjKOQ2ggpcdqMB1mDFJKZJb52mT/g6W/7E8ox4AOr4fY/3ftroIwZOXLb3eA/B93ZMWYdhZ93t5XRfZx917AP3V8lHyurQ8egDYlXzYKGPbaR5k23HSrrRXxG8T6JbSJLJGeh+g/t546XfDgnm1RFRSLQJYWUkrQLOWgZ0DGH0dDAIbjZ9enPSh3lOdo4nHALzTi5P+x3efY43btebw+rKL7Uent7EH4J/D68sxgIDVCn6zCz3fWS0j3YswnHV8fwRV/3PjNhdhGEkguS7QcfX4lpWKcY+UWfYSyB9sCOyGKJ7/uzZgL1KmC8CbdYGzjKqPkH5Rn/X39mVSn6ufI1GjOB3AymIEyyWcmuIKqizWzHTDkq9aZQrGLoDvpxcnN1CjsbOK2qmU5KQWKY2k2wBA//D6cvjt9dvIQvtNNta5qMCmlcHWmKBeI3UHGY/lWc0sqdW6bj/a6/h+t0Dw+ZeG2qp3G0Z9Y6QHsJv+3imal95G5CQnA9ij8bgLNTpYp4N8HvdQZbFi0w1LukAAc5PeXkGNxo4AjOqUViC38QPYrye8A+DL0iIITCso72oRhpsmdxUmt6+TRQxWJ+TFUIsWJJ9fbfYF+bvS9oP7PBcCUo83Qvqxx0P+UVjuA0QEwMEA9mg8DmBv1Ksqc6gRVysTdCRdYATz7+kO1EjGsA6BrEOB66p9MK1Ah6xc0a3IhLFNufn7AM5lUQWt7RvQzXisSKWUCdID2Kw2iIjWciaAlXSBCO4FD2VdQY26urCKli3LgWwEFcjOrPZISKpAH+qiyfXvHtMKistcDrQMCV5j5N+/9qEmUV3p7IdFcd4nLsIwXlpKl4ioNOsBrFQXiFCsfEkd2FxFy9WKDTtQQdjg9OIkWapyYmNU9vD68gAqcK3b967taQV3yBc4zaDWvM/z3G1NsP2KVPQLayATUWFWA1ip6RqjeekCw6+DQWSjcVlFqw4pGMka6V8kmJ0AiD+++1xJQCbVBDz8ylN0/f3ZpK1pBbHuNIBtSCWBTZN1bvArZ7OHZnzvlnXzPnFDiau2fHeJSCNrAWxDg9cxVK6rrXSBCO7fBl8nCWZxenEyhzrpx5BRNABTDaO0/5Z8vasGUIsgDL+9fmt89bYW62c8dg/gYF3KQsf3A5Svu+wKD/knX3mV9YKIWsnKUrINDF7vAPzxdTAwnut6enHSPb04mUDl1tUxeF21A5n0AlXw/TuA/0mATuvtAvj78PoylpFmql435fdzqDqhs3UPyujxX9V0Sb8NKRgHkgecRz/jsaw2iIjWsjUCG6EZwesDVLqA8ZGvpVW06pAuQGbsA/j38PryPYBRi9IKbEhbGjTOURdVd5pM1TmkN1ifK74DdfwJsl68Id1iXnGeMhE1lPER2KPxuA/7s+LLmgN4D6BnKXg9gDoJnoPBK/3uHMBUJqpRNVyaPOdVvP2sY9y5LI+7lizNmvV6pr0Q0VZsjMAGFtrU6QZq1HVmuuHTi5MuzC5rSvWVpBXcAeh/e/12Zrk/bfGq4/u9pUUL1ulrbnNPcmsjyETFRRhqu3iR5W8DpKcofZEgdgQV2P+AGqHuY3PFhUBLJ4modYwGsJL7Wtc8zQcA/ZasokXNwbSCakyQfiEZd3x/uLpcqdxKDzJeV8Y5liaHdXzf03xrvg+Vj57m50TMAt7rrs1LRO1hOoWgb7g9HeYA3n8dDLqWgtc+1Ex8Bq9UBtMK9Iqgjg3r7ECNSv7o+H4sPwuoALBM8FokbcEr0c5vJBgea9zkvQvl0IiovkwHsGkTH1x1BaD7dTAITDd8enHSO704iaFm4jPPlXRI0gomrFZQjkzUGm54WlJRQ9eIa1TgudovVBZhOISeVcTuwbJaRFQSA9j17gG8+DoY9C2UxXomy63+A+a6UjVeQY3GBrY7UmeSIvCm4MsesGUZLcmrzTsKulegxFWRPvSh/ua00edNxosw7OWo1EBElMl0AOv6SOIcwF9fB4OepXSBIVS6AJeapKrtADg/vL6cHV5ferY7U1cSxL6AqgWd5WflEpSoYCCjoO9zPFXHSGlaHyKoOrjvkT+QvQLws+HFfQAAEHVJREFUh/S/jawv207UNJ3FYmGssaPx2FxjxdleRWuE+pcXq9KLj+8+x9u++PD60uXvngtuAAxZrWB7UjLKg6rL6uFXgf5Yd61TWZrVgwokvaQdqAoAE5OTo2RyWtKH5L9JNYIYwJQjrkSkGwNYNXIy/DoYGK/rKGWxRlhfJJyeYgBbvTlUpYLAdkeIiIiymL6tcQ93RhkfoEZcIxuNn16cBOAqWuSWJK2gD1U7NrbbHSIiovVMB7AzuBHAvgcwspguEKG+9XCp+XYBfD+8vryBCmR5+5eIiJxiOoCNYfd2+R3UYgQz0w1zFS2qoVcAZofXl8G3129HtjtDRESUMB3ARgA+GW4TUOkCw6+DgfF1t2UVrSGWVskhqpEdAJ8krWDItAIiInKB0TJacsu+svIuayyvomUjeO1DzcZl8Ep1tweVVhAdXl9qry9KRERUhOk6sIBaC9yEGwA9B1bRYq4rNckxVFpBW+t5EhGRA4yW0UocjccBqhuVfIDKc40r2n4qSRcIAAxMt90CLKPlnnswrYCIiCywMQILGRW90bzZZBWtruVVtBi8UlswrYCIiKywEsCKPjYvv5jXFYDu18HA+Ezp04sT7/TiZAo1OY01XamNmFZARERGWUkhWHY0Ho+w/ajlHdRiBLG+HuUj6QIjqJM3VY8pBPVwB5VWYHxlOyIiag/rASwAHI3HHlTuaN4aqVxFq322DmAPry97AP7R2x3aYAwg4CIIRERUBScC2MTReNyDSi3o4fdg9g6qJNXExogrwFW0LCsTwHoAvmvtDeUxhxqNjWx3hIiImsWpANZVsorWCHZXEWs7BrD1xbQCIiLSyvRKXLXCVbScMrPdAdraPoB/Dq8vmVZARERa2KxC4LTTi5MDcBUtZ3x893lmuw9U2gCqWkHfdkeIiKjeOAK7QtIFIuSfUEZE+e0A+CJBbP/b67czu90hIqI6YgAruIoWkVH7AP49vL58D2DEtAIiIiqCKQQATi9O+uAqWkQ2nAOYHl5fHtjuCBER1UerR2ClLFYApgsQ2bQL4O/D68s7MK2AiIhyaGUAy1W0iJzEtAIiIsqldSkEpxcnQ6h0AQavRG5iWgEREWVqzQispAuMAOxZ7goRbca0AiIiStX4AJaraBHVGtMKiIjoN41OITi9OAmgFiNg8EpUb0wrICKinxo5AivpAhHUbUgiaoYkreAGKq2Ao7FERC3VuBHY04uTEYDvYPBK1FSvoJak7dnuCBER2dGoAPb04iQCFyMgaoMdADGDWCKidmpMACsjryyNRdQeSRDbtd0RIiIyqxEBrOS8cuSVqH12AExsd4KIiMxqRAALNWGLiNpp7/D6cmi7E0REZE7tA9jTi5M+OGGLqO2Cw+vLZ7Y7QUREZjShjFbfdgc0e4Ba6jaWf08BrJYLegYgmbziAeiCQTwB91DflXjpd1P57/Jkpx7Ud6ZJq9LtADgA78YQEbVCrQPY04uTZ1Ar9dTZHVTAEX989zku8LoneX+y4pgnPwdQJ3Rqthuo78702+u38Ybnrs0TlVn83tJPnb83DGCJiFqi1gEsno4q1ckNVEAx+fjus5Zi7B/ffZ5BnbwjADi9ODmAGp3mKmT1/Z6s8/O7o6OQ/7fXb6dQo7QjAJCVrpKfugWz/K4TEbVE3QNYz3YHCphDBQmRBJuV+vju8wTAREZmh1DBbN0CEl3qnhv587vz7fXbWZUNfXv9dgIZrT28vuxDfW9qc5fj8PqyJ0E5ERE1WN0D2Dp4ABB8fPc5stG4BMtDqZMbgLVy6yQJXEc2lk399vptBCCSNIMh6vHdqfvFChER5cAAtjpzAENbgesqCWT7EshGaNYEnia6ATCsesQ1DxnR7B9eXwbgRRARETmg9mW0HPUeQNeV4HXZx3efpx/ffe5B9ZHcMwfw57fXbw9cCF6XfXv9dvbt9ds+gP9CTT4kIiKyou4BbGy7AytuAPzx8d3nQNfkrKp8fPc5APACKmAiN9wA6EoeqrO+vX47/fb6rQfgT6gUGZc4vd8REZEedQ9gXZms8QDgxcd3nw9MTNDSRcp29aDqh5Jd72XUtTYBmATaTo3mcwIXEVE71DqAlVFOm8HXHMBfH9997has4eoMCbg9MIi16c23128D253YxrfXb39I311IK7ix3D4RERlS6wBWjCy1ewWV52qrfW3kQsCDu0Gs7cCoKnMAL2S2f60tpRW8gb20FKdTL4iISJ8mBLATmD1h3gH478d3n/uu57kWUYMgtom8HCto1YoE410AY8NNz8EAloioNWofwErgNTTQ1AOANx/fffY+vvvcyDw7BrFGvWlqvqakFQyh0gpMfZes1MolIiI7ah/AAoCUq6oy/+09gJ6LZbF0kyC2D1YnqNJfTUgb2ETSCnoA/kK136f7uuYQExHRdhoRwIo+9I/21KYslk4ywty33Y+Guvr2+m3t86aLkL+3C5U3rtsc/K4SEbVOYwJYzbe/a1kWS6eP7z5PYD6PsekeYCbdxTmSVtCHqj2s60JzDpVH3MhUDCIiSteYABZQQWzJVaZqXxZLswDuFaqvs1rVea3Ct9dvY0kreI9yaQX3YPBKRNRajQpgE7LK1B/If8tyjl/Lv7bq9m6WpXxYKm/MYOsXyVntoXhaQbKvMnglImqxzmKxsN2HSp1enDwDcAB1suytPDyFWo42tp3jenpx4kHlCXZTnjIDMLMxMnx6cTIB8Mp0u0vuPr777G374sPrywDAubbeFPcAoGdj9PXw+rIH4Bmefrdm8vPDhSDw8Poy2UcPoNKAdtY87Q6qTFbU9lFsIiJqQQDrqtOLky5+nbT3C778BirwjkwE3tLXf6tuJ0PdA9g3pqoOSMCaBIJ5v1f3kO+TCwEtABxeX3ryv1MGrEREtIoBrGEy0jqEvhHNK6hANta0vbVOL04iAMdVtpGhzgHsw7fXb7tVNrA0ghkA2C25uQcAEVhXlYiIHNbIHFgXnV6cdE8vTmIA36H3dvwxgO+nFycTGSmtSlDhtpssqHLjh9eXQ6h0gC8oH7xCtnEOYHZ4fRlIcExEROQUBrAGnF6cBFC34IumChTxCsD09OKkkjJNUk6sijqeTfZQVerA4fVl7/D6cgrgE9bnjJa1AxXITpdu5xMRETmBAWyFTi9Onsmoq6nb1zsAPp1enMQyeU03VmgoppL3S0Zd/wGwV8X2V+wC+H54fcnPnoiInMEAtiKnFyc9qCoHVY66ptkHEEsftJEVukytbd8Eke4NHl5fRlCjrqYNDq8vY6YUEBGRCxjAVkACxxh6chK3tYcKglhUEJQZ0LXQ5o3uSVASvNqaSAfIhRGDWCIiso0BrGYykSpGNXmJRe0AmGhOJ5ho3JYpXQttan2fHAheE3tgEEtERJYxgNVIAsUJ3AheE7tQAbUWMpmLaQSbaQtgJf/UheA1sYd6jsQTEVFDMIDVawQzE2uK2ju9ONE5CaeOo7Am3elKHzi8vjwAMNCxLc1eSX1dIiIi4xjAanJ6cXIAt0bJVg1kEQUdYk3baapYx0bkNn2kY1sVOZeVv4iIiIxiAKuBpA7UocxQpGMjVa/61QCxpu1EcCsdZZ06fO+JiKhhGMDqMYTdigN57cqiCjrcadpO43x7/TYuuw1ZPEDnim1V2T+8vuzb7gQREbULA9iSZPS1ktWvKqKrr1NN22kaXRPcAk3bMSGw3QEiImoXBrDl9eH+bd5lO6cXJ30N22EAu96s7AYkr9TGAhjb2uUoLBERmcQAtrw6jb4mdPR5pmEbTaQjsK/jd6pvuwNERNQeDGBLkFWu6pD7umpPFlwogyOw6+l4Xw40bMO0/cPry67tThARUTswgC2njoFGolTfP777rHWZ1AYp9b7I5K06paQsq/P+QERENcIAthzPdgdK0BFsPGjYBj3l2e5ACZ7tDhARUTswgC2nThNtVukoQD/TsA16yrPdgRI82x0gIqJ2YAC7Jcl/rbMdDXmwpsS2O1BA2RzYOl8U7cjqYURERJViALu9Jpyou7Y70DTfXr/dOge2IcFf3S/siIioBhjAbs+z3QENurY7QE80IfhrQhBORESOYwDbbl3bHaDGaUIQTkREjmMAS6TPne0OEBERtQEDWCIiIiKqFQawRERERFQrDGC3N7PdAQ1i2x2gxoltd4CIiJqPAez2ZrY7QM3y7fXb2HYfiIiI6oAB7PZmtjtQ1sd3n2PbfTCkTqWd5rY7UAaDcCIiMoEB7JY+vvs8Q72DjQfbHTBoz3YHCii7kpdNbfpOERGRRQxgy4ltd6CE2HYHaK3YdgdKiG13gIiI2oEBbDkT2x0oIbbdAVqL3ykiIqINGMCWU+dgo859b6xvr99OUd9b8fxOERGREQxgS/j47vMPADe2+7GFK+k7uamOgeDVt9dv+Z0iIiIjGMCWN7LdgS1EtjtAmfidIiIiysAAtiQpRVWnW753LSqfVUvfXr+dAbiy3Y8C7lg+i4iITGIAq0ffdgcKCGx3gHIJbHeggMB2B4iIqF0YwGogI5p3tvuRww1HX+tBRmHf2+5HDhx9JSIi4xjA6tOH2wsbzKF/pLhOK1zV0Qhup6dU8Z0iIiLaiAGsJrIy19B2PzL0K6g8UKcVrmpHZvUf2O5HhqGMFBMRERnFAFajj+8+R3Bz8s3447vPdSzN1HpSF/aN7X6sMf72+m1kuxNERNRODGA1+/jucx9uBbFXH999dnlkmDaQQNGp79S312/5nSIiImsYwFbAoSD2SvpCNfft9ds+HPlOSV+IiIisYQBbEQeC2DGDV+NmVW5cAse/qmxjAwavRETkBAawFZIA8g3MVieYA3hjKG3A1Az5WcnX16WfG317/XYE4E9Y+E4xeCUiIlcwgK2YTOzqwUyd2DsAPWnThFlN2pnq6IQr7Xx7/XYCoAvgxkBzdwB6nLBFREQu+Y/tDrSBlNjyTi9O+lCrFu1qbuIBwNBCpYEpgH1D7ZQRA3iloR952jEiKbF1eH3pQX2ndH8OD1Blsli9goiInNNZLBa2+9A6pxcnB1AF4MsGVTcAIlslsuTv+LviZu4/vvvcK7OBw+vLLoB/9XQn1c2312+t1WyVQLYP4Ljkpm4ARAxciYjIZQxgLTq9OHkGVajeg0oz2LQwwD3UaGQMYFLBwgSFnV6czKB/RHnZXx/ffR6V3cjh9WWMakeLX7iwpOrh9eUzqO9T8lPoOyUju0RERE5jAOuY04uTLlR+47KZpCE4R9IivlS0+TmAro5A/fD6sgfgn/JdWuvu2+u3XkXbLk2C2tVR7BlX0SIiorpiAEulnV6cTFHNsrJaRl8Th9eXIwADXdtb8l9ZMYuIiIgMYBUC0qEP/WWd7nQGrwAgq0fd69wmVHkpBq9EREQGMYCl0j6++zyFCmJ1uYfKDa6CB31B7BuWlyIiIjKPASxpIZUQXqD8SOw9AK+qCWoySclDuVXSksL+kY4+ERERUTHMgSWtZBJahO1m/I8BBKaqKxxeXx4AGKFYFYUbqPqos0o6RURERBsxgKVKnF6ceMhfYP8KKnCdVdilVBLIJuXM1gWz91BlpkYMXImIiOxjAEuVkhFZD6o0mCe//gFVe3QKIHahnu0yWfigC5aaIiIichIDWCIiIiKqlf8fVbP2H/PF8gkAAAAASUVORK5CYII=";
let logoDataUrl = DEFAULT_LOGO_DATA_URL;
let userLocationMarker = null;
let userAccuracyCircle = null;
let geoWatchId = null;
let isTracking = false;

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving/';
const MARKER_COLOR = '#0d9488';
const STORAGE_KEY = 'visit_route_maps';

// ============================================
// LOCAL STORAGE
// ============================================

function getSavedRoutes() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
}

function saveRouteToStorage(routeId, routeData) {
    const routes = getSavedRoutes();
    routes[routeId] = routeData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
}

function getRouteFromStorage(routeId) {
    return getSavedRoutes()[routeId] || null;
}

function deleteRouteFromStorage(routeId) {
    const routes = getSavedRoutes();
    delete routes[routeId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
}

function generateRouteId() {
    return 'route_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
}

// ============================================
// URL PARAMS
// ============================================

function getUrlParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function buildShareLink(routeId) {
    return window.location.origin + window.location.pathname + '?route=' + encodeURIComponent(routeId);
}

// ============================================
// MAP
// ============================================

// ============================================
// MOBILE DETECTION & RESPONSIVE HELPERS
// ============================================

function isMobileDevice() {
    return window.innerWidth <= 768 ||
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isSmallMobile() {
    return window.innerWidth <= 480;
}

function applyMobileLayout() {
    // Hide sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    if (sidebar && isMobileDevice()) {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('flex');
        if (toggleBtn) toggleBtn.style.display = 'none';
    }

function toggleRouteHighlight() {
    routeHighlightActive = !routeHighlightActive;
    const btn = document.getElementById('mobileShowRouteBtn');

    if (routeHighlightActive) {
        // Highlight: make route lines thicker and more prominent
        routeLines.forEach(line => {
            line.setStyle({
                weight: 6,
                opacity: 1,
                color: '#dc2626'
            });
        });
        // Bring route lines to front
        routeLines.forEach(line => line.bringToFront());
        // Update button state
        if (btn) {
            btn.style.background = '#dc2626';
            btn.style.color = 'white';
            btn.style.borderColor = '#dc2626';
        }
        // Zoom to fit all route lines
        if (routeLines.length > 0) {
            const group = L.featureGroup(routeLines);
            map.fitBounds(group.getBounds(), { padding: [60, 60], maxZoom: 16 });
        }
    } else {
        // Restore original route line styles
        routeLines.forEach((line, i) => {
            // Re-render to restore original styles (real road vs direct line)
            const isReal = !line.options.dashArray;
            line.setStyle({
                weight: isReal ? 4 : 2,
                opacity: 0.9,
                color: isReal ? '#0d9488' : '#94a3b8'
            });
        });
        // Update button state
        if (btn) {
            btn.style.background = '';
            btn.style.color = '#334155';
            btn.style.borderColor = '';
        }
    }
}


    // Ensure map fits viewport
    const mapEl = document.getElementById('map');
    if (mapEl && isMobileDevice()) {
        mapEl.style.width = '100vw';
        mapEl.style.maxWidth = '100vw';
    }

    // Invalidate map size after layout change
    if (map) {
        setTimeout(() => map.invalidateSize({ animate: false }), 100);
    }
}

function initMap() {
    map = L.map('map', {
        zoomControl: false,
        attributionControl: true,
        preferCanvas: true
    }).setView([21.26, 92.12], 13);

    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.scale({ position: 'bottomright', metric: true, imperial: false }).addTo(map);

    const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    });
    const sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri', maxZoom: 19
    });
    L.control.layers({ 'Street Map': street, 'Satellite': sat }, null, { position: 'topright' }).addTo(map);
    street.addTo(map);

    // Square "Track My Location" button, styled like a Leaflet control button.
    // Stacks automatically below zoom/layers in the top-right corner.
    // Hidden by default; shown only in Viewer Mode on mobile screens (see CSS).
    const LocationControl = L.Control.extend({
        options: { position: 'topright' },
        onAdd: function() {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control mobile-location-control');
            container.style.marginTop = '8px';
            container.innerHTML = `<a href="#" id="mobileLocationBtn" title="Track My Location" role="button" style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;color:#334155;">
                <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            </a>`;
            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.on(container.querySelector('a'), 'click', function(e) {
                L.DomEvent.preventDefault(e);
                toggleLocationTracking();
            });
            return container;
        }
    });
    new LocationControl().addTo(map);

    // Show Visit Route toggle control (mobile viewer mode)
    let routeHighlightActive = false;
    let routeHighlightLines = [];

    const ShowRouteControl = L.Control.extend({
        options: { position: 'topright' },
        onAdd: function() {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control show-route-control');
            container.style.marginTop = '8px';
            container.innerHTML = `<a href="#" id="mobileShowRouteBtn" title="Show Visit Route" role="button" style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;color:#334155;">
                <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.447-.894L15 7m0 13V7"/>
                </svg>
            </a>`;
            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.on(container.querySelector('a'), 'click', function(e) {
                L.DomEvent.preventDefault(e);
                toggleRouteHighlight();
            });
            return container;
        }
    });
    new ShowRouteControl().addTo(map);

}

// ============================================
// MARKERS - L.divIcon for interactive (visible numbers), NOT captured by html2canvas
// ============================================

function createNumberedMarker(lat, lng, number, activity) {
    // Use L.divIcon for interactive map - numbers are clearly visible
    const icon = L.divIcon({
        html: `<div class="custom-marker" style="background: ${MARKER_COLOR};">${number}</div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    const m = L.marker([lat, lng], { icon: icon });

    // Activity tooltip on hover
    m.bindTooltip(`<strong>${number}. ${activity || 'Visit ' + number}</strong>`, {
        permanent: false, direction: 'top', offset: [0, -18], className: 'leaflet-tooltip'
    });

    return m;
}

// ============================================
// OSRM ROUTING
// ============================================

async function fetchOSRMRoute(sLat, sLon, eLat, eLon) {
    const url = `${OSRM_BASE}${sLon},${sLat};${eLon},${eLat}?overview=full&geometries=geojson`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('fail');
        const data = await res.json();
        if (data.code !== 'Ok' || !data.routes?.length) throw new Error('no route');
        return {
            coords: data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]),
            dist: data.routes[0].distance,
            dur: data.routes[0].duration
        };
    } catch (e) { return null; }
}

function directDist(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function parseDur(s) {
    const m = String(s || '').match(/(\d+)/);
    return m ? parseInt(m[1]) : 0;
}

function clean(v) {
    return v === undefined || v === null ? '' : String(v).trim();
}

// ============================================
// CLEAR & RENDER
// ============================================

function clearMap() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    routeLines.forEach(l => map.removeLayer(l));
    routeLines = [];
    routeLabels.forEach(l => map.removeLayer(l));
    routeLabels = [];
}

async function renderRoute(data, showDistLabels = true) {
    clearMap();
    visitData = data;
    if (data.length === 0) return;

    const allLL = [];
    let totalDist = 0, totalDur = 0, osrmOk = 0;

    // Markers - using divIcon (visible numbers on interactive map)
    data.forEach((item, i) => {
        const lat = parseFloat(item.lat), lon = parseFloat(item.lon);
        const num = parseInt(item.Sl) || (i + 1);
        const act = clean(item.Activity) || ('Visit ' + num);
        allLL.push([lat, lon]);

        const m = createNumberedMarker(lat, lon, num, act);

        // Full popup with all activity information
        const popup = `
            <div style="min-width:260px;font-family:Inter,sans-serif;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #e2e8f0;">
                    <span style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:13px;font-weight:700;background:${MARKER_COLOR}">${num}</span>
                    <div>
                        <div style="font-weight:700;font-size:14px;color:#1e293b;line-height:1.3;">${act}</div>
                        <div style="font-size:11px;color:#64748b;margin-top:2px;">${clean(item.Camp)}</div>
                    </div>
                </div>
                <div style="font-size:12px;color:#475569;line-height:1.8;">
                    <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Time:</span><span style="font-weight:600;color:#334155;">${clean(item.Time)||'--'}</span></div>
                    <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Duration:</span><span style="font-weight:600;color:#334155;">${clean(item.Duration)||'--'}</span></div>
                    <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Agency:</span><span style="font-weight:600;color:#334155;">${clean(item.Agency)||'--'}</span></div>
                    <div style="display:flex;justify-content:space-between;"><span style="color:#94a3b8;">Coords:</span><span style="font-weight:500;color:#334155;font-size:11px;">${lat.toFixed(6)}, ${lon.toFixed(6)}</span></div>
                </div>
            </div>`;
        m.bindPopup(popup, { closeButton: true, maxWidth: 300 });
        m.on('click', () => highlightCard(i));
        m.addTo(map);
        markers.push(m);
    });

    // Route lines
    if (data.length > 1) {
        showOSRMLoading(true);
        for (let i = 0; i < data.length - 1; i++) {
            const sLat = parseFloat(data[i].lat), sLon = parseFloat(data[i].lon);
            const eLat = parseFloat(data[i+1].lat), eLon = parseFloat(data[i+1].lon);

            let segCoords = [], segDist = 0, segDur = 0, isReal = false;

            if (useRealRoute) {
                const r = await fetchOSRMRoute(sLat, sLon, eLat, eLon);
                if (r) { segCoords = r.coords; segDist = r.dist/1000; segDur = r.dur; isReal = true; osrmOk++; }
            }
            if (!isReal) {
                segCoords = [[sLat,sLon],[eLat,eLon]];
                segDist = directDist(sLat, sLon, eLat, eLon);
                segDur = (segDist/30)*3600;
            }
            totalDist += segDist; totalDur += segDur;

            const line = L.polyline(segCoords, {
                color: isReal ? '#0d9488' : '#94a3b8',
                weight: isReal ? 4 : 2, opacity: 0.9,
                dashArray: isReal ? null : '8,6',
                lineCap: 'round', lineJoin: 'round'
            }).addTo(map);
            routeLines.push(line);

            // Distance labels
            if (showDistLabels && segCoords.length > 0) {
                const mp = segCoords[Math.floor(segCoords.length/2)];
                const li = L.divIcon({
                    html: `<div class="route-label">${segDist.toFixed(1)} km</div>`,
                    className: '', iconSize: [60,20], iconAnchor: [30,10]
                });
                const lm = L.marker(mp, { icon: li, interactive: false, zIndexOffset: 1000 });
                lm.addTo(map); routeLabels.push(lm);
            }

            // Arrow dots along route
            if (segCoords.length > 2) {
                for (let j = 1; j < segCoords.length - 1; j += Math.max(1, Math.floor(segCoords.length / 5))) {
                    const arrowIcon = L.divIcon({
                        html: `<div style="width:6px;height:6px;background:${isReal?'#0d9488':'#94a3b8'};border-radius:50%;border:1.5px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
                        className: '', iconSize: [6,6], iconAnchor: [3,3]
                    });
                    const am = L.marker(segCoords[j], { icon: arrowIcon, interactive: false });
                    am.addTo(map); routeLabels.push(am);
                }
            }
        }
        showOSRMLoading(false);
    }

    if (allLL.length > 0) map.fitBounds(L.latLngBounds(allLL), { padding: [100,100], maxZoom: 16 });
    updateStats(data, totalDist, totalDur, osrmOk);
    updateRouteStatus(data, osrmOk);
}

function updateStats(data, totalDist, totalDur, osrmCount) {
    const totalMins = data.reduce((s, it) => s + parseDur(it.Duration), 0);
    const driveMin = Math.round(totalDur/60);
    const countEl = isViewerMode ? document.getElementById('viewerVisitCount') : document.getElementById('visitCount');
    const durEl = isViewerMode ? document.getElementById('viewerTotalDuration') : document.getElementById('totalDuration');
    if (countEl) countEl.textContent = `${data.length} visit${data.length!==1?'s':''}`;
    if (durEl) durEl.textContent = `${totalMins} min total visit time`;
    document.getElementById('totalDistance').textContent = totalDist > 0 ? `${totalDist.toFixed(2)} km` : '--';
    document.getElementById('locationCount').textContent = data.length;
    document.getElementById('estDriveTime').textContent = driveMin > 0 ? `~${driveMin} min` : '--';
}

function updateRouteStatus(data, osrmCount) {
    const el = document.getElementById('routeStatus');
    if (!el) return;
    if (useRealRoute && data.length > 1) {
        const total = data.length - 1;
        if (osrmCount === total) { el.textContent = '✓ All routes use real roads'; el.className = 'text-[10px] text-teal-600 mt-2 font-medium'; }
        else if (osrmCount > 0) { el.textContent = `⚠ ${osrmCount}/${total} real roads`; el.className = 'text-[10px] text-amber-600 mt-2 font-medium'; }
        else { el.textContent = '✗ Using direct lines'; el.className = 'text-[10px] text-red-500 mt-2 font-medium'; }
    } else { el.textContent = 'Using direct lines'; el.className = 'text-[10px] text-slate-400 mt-2'; }
}

// ============================================
// SIDEBAR
// ============================================

function renderSidebar(data, containerId) {
    const c = document.getElementById(containerId);
    if (!c) return; c.innerHTML = '';
    if (data.length === 0) {
        c.innerHTML = `<div class="text-center py-12 text-slate-400"><p class="text-sm">No visits to display</p></div>`;
        return;
    }
    data.forEach((item, i) => {
        const num = parseInt(item.Sl) || (i+1);
        const act = clean(item.Activity) || ('Visit '+num);
        const time = clean(item.Time);
        const dur = clean(item.Duration);
        const camp = clean(item.Camp);
        const agency = clean(item.Agency);

        const card = document.createElement('div');
        card.className = 'visit-card bg-white rounded-xl p-4 mb-2 cursor-pointer border border-slate-100';
        card.dataset.index = i;
        card.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style="background:${MARKER_COLOR}">${num}</div>
                <div class="flex-1 min-w-0">
                    <p class="font-semibold text-slate-800 text-sm leading-tight mb-1">${act}</p>
                    <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span class="flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            ${time||'--'}
                        </span>
                        <span class="text-slate-300">|</span>
                        <span>${dur||'--'}</span>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">${camp||'--'}</span>
                        ${agency?`<span class="px-2 py-0.5 rounded text-[10px] font-medium text-white" style="background:${MARKER_COLOR}">${agency}</span>`:''}
                    </div>
                </div>
            </div>`;
        card.addEventListener('click', () => {
            highlightCard(i);
            map.setView([parseFloat(item.lat), parseFloat(item.lon)], 16);
            markers[i].openPopup();
        });
        card.addEventListener('mouseenter', () => {
            const el = markers[i]?.getElement();
            if (el) el.querySelector('.custom-marker')?.classList.add('marker-pulse');
        });
        card.addEventListener('mouseleave', () => {
            const el = markers[i]?.getElement();
            if (el) el.querySelector('.custom-marker')?.classList.remove('marker-pulse');
        });
        c.appendChild(card);
    });
}

function highlightCard(idx) {
    const cid = isViewerMode ? 'viewerVisitList' : 'visitList';
    document.querySelectorAll(`#${cid} .visit-card`).forEach((c, i) => {
        if (i === idx) { c.classList.add('active'); c.scrollIntoView({behavior:'smooth',block:'center'}); }
        else c.classList.remove('active');
    });
    markers.forEach((m, i) => {
        const el = m.getElement()?.querySelector('.custom-marker');
        if (el) {
            if (i === idx) el.classList.add('active','marker-pulse');
            else el.classList.remove('active','marker-pulse');
        }
    });
}

// ============================================
// SIDEBAR TOGGLE
// ============================================

function toggleSidebar() {
    sidebarVisible = !sidebarVisible;
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggleBtn');

    if (sidebarVisible) {
        sidebar.classList.remove('hidden');
        sidebar.classList.add('flex');
        toggleBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>`;
        toggleBtn.title = 'Hide Sidebar';
    } else {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('flex');
        toggleBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>`;
        toggleBtn.title = 'Show Sidebar';
    }

    setTimeout(() => {
        map.invalidateSize({ animate: false });
    }, 300);
}

// ============================================
// MAP OVERLAY
// ============================================

function updateMapOverlay(title, subtitle, date, source) {
    document.getElementById('mapTitle').textContent = title || 'Untitled Route';
    document.getElementById('mapSubtitle').textContent = subtitle || '';
    document.getElementById('mapDate').textContent = date ? fmtDate(date) : '--';
    document.getElementById('mapSource').textContent = source ? `Data source: ${source}` : '--';
}

function fmtDate(d) {
    if (!d) return '--';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString('en-US', {day:'numeric',month:'long',year:'numeric'});
}

// ============================================
// LOGO UPLOAD
// ============================================

function processLogoFile(file) {
    if (!file || !file.type.startsWith('image/')) { alert('Please upload a valid image file.'); return; }
    const reader = new FileReader();
    reader.onload = (e) => { logoDataUrl = e.target.result; updateLogoDisplay(); };
    reader.onerror = () => alert('Failed to read the logo image.');
    reader.readAsDataURL(file);
}

function updateLogoDisplay() {
    const mapLogo = document.getElementById('mapLogoImg');
    const zoneEmpty = document.getElementById('logoZoneEmpty');
    const zonePreview = document.getElementById('logoZonePreview');
    const removeBtn = document.getElementById('btnRemoveLogo');
    if (logoDataUrl) {
        mapLogo.src = logoDataUrl; mapLogo.classList.remove('hidden');
        zonePreview.src = logoDataUrl; zonePreview.classList.remove('hidden');
        zoneEmpty.classList.add('hidden');
        removeBtn.classList.remove('hidden');
    } else {
        mapLogo.src = ''; mapLogo.classList.add('hidden');
        zonePreview.src = ''; zonePreview.classList.add('hidden');
        zoneEmpty.classList.remove('hidden');
        removeBtn.classList.add('hidden');
    }
}

function removeLogo() {
    logoDataUrl = null;
    updateLogoDisplay();
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// ============================================
// LIVE LOCATION TRACKING (Viewer Mode)
// ============================================

function toggleLocationTracking() {
    if (isTracking) { stopLocationTracking(); return; }
    if (!navigator.geolocation) { alert('Geolocation is not supported on this browser/device.'); return; }

    const status = document.getElementById('locationStatus');
    status.classList.remove('hidden');
    status.textContent = 'Requesting location permission…';

    geoWatchId = navigator.geolocation.watchPosition(
        pos => {
            if (!isTracking) {
                isTracking = true;
                const btn = document.getElementById('btnTrackLocation');
                document.getElementById('trackLocationLabel').textContent = 'Stop Tracking';
                btn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                btn.classList.add('bg-red-500', 'hover:bg-red-600');
                const mobileBtn = document.getElementById('mobileLocationBtn');
                if (mobileBtn) mobileBtn.style.color = '#dc2626';
            }
            status.textContent = `Live — accuracy ±${Math.round(pos.coords.accuracy)}m`;
            updateUserLocationMarker(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
        },
        err => {
            console.error(err);
            status.textContent = 'Could not get your location: ' + (err.message || 'permission denied');
            stopLocationTracking();
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
}

function stopLocationTracking() {
    if (geoWatchId !== null) navigator.geolocation.clearWatch(geoWatchId);
    geoWatchId = null;
    isTracking = false;

    const btn = document.getElementById('btnTrackLocation');
    const status = document.getElementById('locationStatus');
    if (btn) {
        document.getElementById('trackLocationLabel').textContent = 'Track My Location';
        btn.classList.remove('bg-red-500', 'hover:bg-red-600');
        btn.classList.add('bg-blue-600', 'hover:bg-blue-700');
    }
    const mobileBtn = document.getElementById('mobileLocationBtn');
    if (mobileBtn) mobileBtn.style.color = '#334155';
    if (status) status.classList.add('hidden');

    if (userLocationMarker) { map.removeLayer(userLocationMarker); userLocationMarker = null; }
    if (userAccuracyCircle) { map.removeLayer(userAccuracyCircle); userAccuracyCircle = null; }
}

function updateUserLocationMarker(lat, lng, accuracy) {
    if (!userLocationMarker) {
        const icon = L.divIcon({
            html: '<div class="user-location-dot pulsing"></div>',
            className: '', iconSize: [18, 18], iconAnchor: [9, 9]
        });
        userLocationMarker = L.marker([lat, lng], { icon: icon, zIndexOffset: 2000 }).addTo(map);
        userLocationMarker.bindTooltip('You are here', { permanent: false, direction: 'top', offset: [0, -12] });
        userAccuracyCircle = L.circle([lat, lng], {
            radius: accuracy, color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.1, weight: 1
        }).addTo(map);
        map.setView([lat, lng], 16);
    } else {
        userLocationMarker.setLatLng([lat, lng]);
        userAccuracyCircle.setLatLng([lat, lng]);
        userAccuracyCircle.setRadius(accuracy);
    }
}

// ============================================
// MOBILE VIEWER LAYOUT (tap-to-expand title, Route Summary + Disclaimer sheet)
// ============================================

function toggleTitleDetails() {
    document.getElementById('mapTitleOverlay').classList.toggle('expanded');
}

function openMobileInfoSheet() {
    const summaryHtml = document.getElementById('routeSummaryCard').innerHTML;
    const disclaimerHtml = document.getElementById('disclaimerCard').innerHTML;
    document.getElementById('mobileInfoSheetContent').innerHTML =
        summaryHtml + '<div class="border-t border-slate-100 my-3"></div>' + disclaimerHtml;
    document.getElementById('mobileInfoSheetBackdrop').classList.remove('hidden');
    document.getElementById('mobileInfoSheet').classList.remove('hidden');
}

function closeMobileInfoSheet() {
    document.getElementById('mobileInfoSheetBackdrop').classList.add('hidden');
    document.getElementById('mobileInfoSheet').classList.add('hidden');
}

// ============================================
// SAVED ROUTES UI
// ============================================

function renderSavedRoutes() {
    const c = document.getElementById('savedRoutesList');
    const routes = getSavedRoutes();
    const ids = Object.keys(routes);
    if (ids.length === 0) {
        c.innerHTML = `<p class="text-sm text-slate-400 text-center py-4">No saved routes yet.<br>Upload data and save to create shareable links.</p>`;
        return;
    }
    c.innerHTML = '';
    ids.forEach(id => {
        const r = routes[id];
        const div = document.createElement('div');
        div.className = 'saved-route-card bg-white rounded-xl p-3 border border-slate-200 cursor-pointer';
        div.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0" onclick="window.loadSavedRoute('${id}')">
                    <p class="font-semibold text-slate-800 text-sm truncate">${r.title||'Untitled'}</p>
                    <p class="text-xs text-slate-500 truncate">${r.subtitle||''}</p>
                    <div class="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span>${fmtDate(r.date)}</span>
                        <span>${r.visits?.length||0} visits</span>
                    </div>
                </div>
                <div class="flex flex-col gap-1 ml-2">
                    <button onclick="event.stopPropagation(); window.shareRoute('${id}')" class="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center justify-center transition" title="Share">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    </button>
                    <button onclick="event.stopPropagation(); window.downloadRouteJSON('${id}')" class="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition" title="Download JSON">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    </button>
                    <button onclick="event.stopPropagation(); window.deleteRoute('${id}')" class="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition" title="Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </div>
            </div>`;
        c.appendChild(div);
    });
}

window.loadSavedRoute = function(routeId) {
    const r = getRouteFromStorage(routeId);
    if (!r) return;
    currentRouteId = routeId; visitData = r.visits || [];
    document.getElementById('routeTitle').value = r.title || '';
    document.getElementById('routeSubtitle').value = r.subtitle || '';
    document.getElementById('routeDate').value = r.date || '';
    document.getElementById('routeSource').value = r.source || 'RCP';
    logoDataUrl = r.logo || DEFAULT_LOGO_DATA_URL;
    updateLogoDisplay();
    updateMapOverlay(r.title, r.subtitle, r.date, r.source);
    renderRoute(visitData);
    renderSidebar(visitData, 'visitList');
};

window.shareRoute = function(routeId) {
    const link = buildShareLink(routeId);
    document.getElementById('shareLinkBox').textContent = link;
    document.getElementById('shareModal').classList.remove('hidden');
};

window.downloadRouteJSON = function(routeId) {
    const r = getRouteFromStorage(routeId);
    if (!r) return;
    const blob = new Blob([JSON.stringify(r, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `route_${routeId}.json`; a.click();
    URL.revokeObjectURL(url);
};

window.deleteRoute = function(routeId) {
    if (!confirm('Delete this saved route?')) return;
    deleteRouteFromStorage(routeId); renderSavedRoutes();
};

// ============================================
// SAVE ROUTE
// ============================================

function openSaveModal() {
    if (visitData.length === 0) { alert('Please upload a CSV file first.'); return; }
    document.getElementById('saveModal').classList.remove('hidden');
}

function closeSaveModal() { document.getElementById('saveModal').classList.add('hidden'); }

function confirmSaveRoute() {
    const title = document.getElementById('routeTitle').value.trim();
    if (!title) { alert('Please enter a title.'); return; }
    const routeId = currentRouteId || generateRouteId();
    currentRouteId = routeId;
    const routeData = {
        id: routeId, title: title,
        subtitle: document.getElementById('routeSubtitle').value.trim(),
        date: document.getElementById('routeDate').value,
        source: document.getElementById('routeSource').value.trim() || 'RCP',
        createdAt: new Date().toISOString(),
        visits: visitData,
        logo: logoDataUrl || null
    };
    saveRouteToStorage(routeId, routeData);
    renderSavedRoutes(); closeSaveModal(); updateMapOverlay(title, routeData.subtitle, routeData.date, routeData.source);
    setTimeout(() => window.shareRoute(routeId), 300);
}

function downloadCurrentJSON() {
    if (visitData.length === 0) { alert('Please upload data first.'); return; }
    const title = document.getElementById('routeTitle').value.trim() || 'route';
    const routeData = {
        id: generateRouteId(),
        title: title,
        subtitle: document.getElementById('routeSubtitle').value.trim(),
        date: document.getElementById('routeDate').value,
        source: document.getElementById('routeSource').value.trim() || 'RCP',
        createdAt: new Date().toISOString(),
        visits: visitData,
        logo: logoDataUrl || null
    };
    const blob = new Blob([JSON.stringify(routeData, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${title.replace(/\s+/g,'_').toLowerCase()}_route.json`; a.click();
    URL.revokeObjectURL(url); closeSaveModal();
}

// ============================================
// VIEWER MODE
// ============================================

function renderViewerRoute(r) {
    document.getElementById('creatorPanel').classList.add('hidden');
    document.getElementById('creatorPanel').classList.remove('flex');
    document.getElementById('viewerPanel').classList.remove('hidden');
    document.getElementById('viewerPanel').classList.add('flex');
    document.getElementById('btnViewMode').classList.remove('hidden');
    document.getElementById('btnLoadSample').classList.add('hidden');
    document.body.classList.add('viewer-mode');

    document.getElementById('viewerTitle').textContent = r.title || 'Untitled Route';
    document.getElementById('viewerSubtitle').textContent = r.subtitle || '';
    document.getElementById('viewerDate').textContent = fmtDate(r.date);
    document.getElementById('viewerSource').textContent = r.source ? `Data source: ${r.source}` : 'Data source: RCP';

    logoDataUrl = r.logo || DEFAULT_LOGO_DATA_URL;
    updateLogoDisplay();
    updateMapOverlay(r.title, r.subtitle, r.date, r.source);
    visitData = r.visits || [];
    renderRoute(visitData);
    renderSidebar(visitData, 'viewerVisitList');
}

function enterViewerMode(routeId) {
    isViewerMode = true; currentRouteId = routeId;
    const r = getRouteFromStorage(routeId);
    if (!r) { alert('Route not found. It may have been deleted or the link is invalid.'); return; }
    renderViewerRoute(r);
}

async function enterViewerModeFromUrl(url) {
    isViewerMode = true; currentRouteId = null;
    showLoading(true);
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Request failed with status ' + res.status);
        const r = await res.json();
        renderViewerRoute(r);
    } catch (e) {
        console.error(e);
        alert('Could not load the shared route from that link. Please check the URL and try again.');
    } finally {
        showLoading(false);
    }
}

function buildGithubShareLink(rawUrl) {
    return window.location.origin + window.location.pathname + '?src=' + encodeURIComponent(rawUrl);
}

// ============================================
// GITHUB DIRECT PUBLISHING
// ============================================

const GH_SETTINGS_KEY = 'ghPublishSettings';

function getGithubSettings() {
    try { return JSON.parse(localStorage.getItem(GH_SETTINGS_KEY)) || null; }
    catch (e) { return null; }
}

function saveGithubSettings(s) {
    localStorage.setItem(GH_SETTINGS_KEY, JSON.stringify(s));
}

function slugify(s) {
    return (s || 'route').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 50) || 'route';
}

function b64EncodeUtf8(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// Uploads (creates or updates) a route JSON file directly to the configured GitHub repo
// using the GitHub Contents API, then returns the app's viewer link for it.
async function publishRouteToGithub(routeData) {
    const settings = getGithubSettings();
    if (!settings || !settings.owner || !settings.repo || !settings.token) {
        alert('GitHub publishing isn\'t set up yet. Open GitHub settings first.');
        document.getElementById('ghSettingsModal').classList.remove('hidden');
        return null;
    }

    const folder = settings.folder || 'routes';
    const branch = settings.branch || 'main';
    const slug = slugify(routeData.title) + '_' + routeData.id.slice(-6);
    const path = `${folder}/${slug}.json`;
    const apiUrl = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${path}`;
    const headers = {
        'Authorization': `token ${settings.token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
    };

    try {
        // Check whether the file already exists (need its sha to update rather than create)
        let sha = null;
        try {
            const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
            if (getRes.ok) { const j = await getRes.json(); sha = j.sha; }
        } catch (e) { /* file probably doesn't exist yet - fine */ }

        const body = {
            message: `Publish visit route: ${routeData.title}`,
            content: b64EncodeUtf8(JSON.stringify(routeData, null, 2)),
            branch: branch
        };
        if (sha) body.sha = sha;

        const putRes = await fetch(apiUrl, { method: 'PUT', headers, body: JSON.stringify(body) });
        if (!putRes.ok) {
            const errBody = await putRes.json().catch(() => ({}));
            throw new Error(errBody.message || `GitHub API error (HTTP ${putRes.status})`);
        }

        const rawUrl = `https://raw.githubusercontent.com/${settings.owner}/${settings.repo}/${branch}/${path}`;
        return buildGithubShareLink(rawUrl);
    } catch (e) {
        console.error(e);
        alert('Failed to publish to GitHub: ' + e.message);
        return null;
    }
}

function exitViewerMode() {
    isViewerMode = false; currentRouteId = null;
    stopLocationTracking();
    closeMobileInfoSheet();
    document.body.classList.remove('viewer-mode');
    window.history.replaceState({}, document.title, window.location.pathname);
    document.getElementById('viewerPanel').classList.add('hidden');
    document.getElementById('viewerPanel').classList.remove('flex');
    document.getElementById('creatorPanel').classList.remove('hidden');
    document.getElementById('creatorPanel').classList.add('flex');
    document.getElementById('btnViewMode').classList.add('hidden');
    document.getElementById('btnLoadSample').classList.remove('hidden');
    clearMap();
    document.getElementById('visitList').innerHTML = `
        <div class="text-center py-12 text-slate-400">
            <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.447-.894L15 7m0 13V7"/>
            </svg>
            <p class="text-sm">Upload a CSV file to see<br>your visit route</p>
        </div>`;
    updateMapOverlay('', '', '', '');
}

// ============================================
// CSV PROCESSING
// ============================================

// Recognized metadata row keys (case/space-insensitive) -> route field
const CSV_METADATA_KEYS = {
    'routetitle': 'title', 'title': 'title',
    'subtitle': 'subtitle',
    'visitdate': 'date', 'date': 'date',
    'source': 'source', 'datasource': 'source'
};

function normalizeDateForInput(d) {
    if (!d) return '';
    d = String(d).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const dt = new Date(d);
    if (!isNaN(dt.getTime())) {
        const y = dt.getFullYear(), m = String(dt.getMonth()+1).padStart(2,'0'), day = String(dt.getDate()).padStart(2,'0');
        return `${y}-${m}-${day}`;
    }
    return d;
}

function processCSV(file) {
    showLoading(true);
    // Parse raw (no header) first so we can detect leading metadata rows
    // (RouteTitle / Subtitle / VisitDate) before the real header + data rows.
    Papa.parse(file, {
        header: false, skipEmptyLines: true,
        complete: async function(results) {
            try {
                const rows = results.data;
                const meta = { title: '', subtitle: '', date: '', source: '' };
                let dataStartIdx = 0;

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    if (!row || row.length < 2) break;
                    const key = clean(row[0]).toLowerCase().replace(/\s+/g, '');
                    if (CSV_METADATA_KEYS[key]) {
                        meta[CSV_METADATA_KEYS[key]] = clean(row[1]);
                        dataStartIdx = i + 1;
                    } else {
                        break;
                    }
                }

                const dataRows = rows.slice(dataStartIdx);
                if (dataRows.length < 2) {
                    alert('No visit data rows found in this CSV.');
                    showLoading(false);
                    return;
                }

                const headers = dataRows[0].map(h => clean(h));
                const dataObjs = dataRows.slice(1).map(r => {
                    const obj = {};
                    headers.forEach((h, idx) => obj[h] = r[idx]);
                    return obj;
                });

                let data = dataObjs
                    .filter(r => { const lat=parseFloat(r.lat), lon=parseFloat(r.lon); return !isNaN(lat)&&!isNaN(lon)&&lat!==0&&lon!==0; })
                    .map(r => ({Sl:clean(r.Sl), Time:clean(r.Time), Duration:clean(r.Duration), Activity:clean(r.Activity), Camp:clean(r.Camp), Agency:clean(r.Agency), lat:parseFloat(r.lat), lon:parseFloat(r.lon)}));
                data.sort((a,b) => (parseInt(a.Sl)||0)-(parseInt(b.Sl)||0));
                visitData = data; currentRouteId = null;

                // Auto-fill Route Information fields from metadata rows, if present
                if (meta.title) document.getElementById('routeTitle').value = meta.title;
                if (meta.subtitle) document.getElementById('routeSubtitle').value = meta.subtitle;
                if (meta.date) document.getElementById('routeDate').value = normalizeDateForInput(meta.date);
                if (meta.source) document.getElementById('routeSource').value = meta.source;
                if (meta.title || meta.subtitle || meta.date || meta.source) {
                    updateMapOverlay(
                        document.getElementById('routeTitle').value,
                        document.getElementById('routeSubtitle').value,
                        document.getElementById('routeDate').value,
                        document.getElementById('routeSource').value
                    );
                }

                await renderRoute(data); renderSidebar(data, 'visitList'); showLoading(false);
            } catch (err) {
                console.error(err);
                alert('Error parsing CSV: ' + err.message);
                showLoading(false);
            }
        },
        error: function(err) { alert('Error: '+err.message); showLoading(false); }
    });
}

function downloadCSVTemplate() {
    const csv = [
        'RouteTitle,"Bangladesh, Cox\'s Bazar: Rohingya Refugee Response"',
        'Subtitle,Donor field mission',
        'VisitDate,2026-07-01',
        'Sl,Time,Duration,Activity,Camp,Agency,lat,lon',
        '1,10:30 - 11:15,(45 min),Hatimora Aggregation Center,Ukhiya,WFP-FAO,21.2526912,92.1724337',
        '2,11:20 - 11:40,(20 min),Homestead Gardening Egg Plant Cultivation,Rajapalong Ukhiya,WFP,21.254092,92.154327',
        '3,11:50 - 12:10,(20 min),Homestead Gardening Long Bean Cultivation,Rajapalong Ukhiya,WFP,21.254807,92.158063'
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'visit_route_template.csv'; a.click();
    URL.revokeObjectURL(url);
}

// ============================================
// MAP CAPTURE - Use Canvas-native markers for perfect export
// ============================================

let exportMarkers = []; // Temporary canvas markers for export

function hideOverlaysForExport() {
    // Hide route labels (distance labels, arrow dots)
    routeLabels.forEach(l => { if (l.getElement()) l.getElement().style.display = 'none'; });
    // Hide tooltips, popups, controls
    document.querySelectorAll('.leaflet-tooltip').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.leaflet-popup').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.leaflet-control').forEach(el => el.style.display = 'none');
}

function showOverlaysAfterExport() {
    routeLabels.forEach(l => { if (l.getElement()) l.getElement().style.display = ''; });
    document.querySelectorAll('.leaflet-tooltip').forEach(el => el.style.display = '');
    document.querySelectorAll('.leaflet-popup').forEach(el => el.style.display = '');
    document.querySelectorAll('.leaflet-control').forEach(el => el.style.display = '');
}

function waitForTilesToLoad() {
    return new Promise((resolve) => {
        const check = () => {
            const tiles = document.querySelectorAll('.leaflet-tile');
            const loaded = Array.from(tiles).every(t => t.complete && t.naturalWidth !== 0);
            if (loaded && tiles.length > 0) setTimeout(resolve, 800);
            else setTimeout(check, 100);
        };
        setTimeout(check, 300);
    });
}

// Create Canvas-native circleMarker with permanent number tooltip for export
function createExportMarker(lat, lng, number) {
    const marker = L.circleMarker([lat, lng], {
        radius: 16,
        fillColor: MARKER_COLOR,
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 1,
        renderer: L.canvas()
    });
    // Permanent number label - Canvas rendered, captured by html2canvas
    marker.bindTooltip(String(number), {
        permanent: true,
        direction: 'center',
        className: 'marker-number-label',
        offset: [0, 0]
    });
    return marker;
}

async function captureMapForExport() {
    // 1. Hide interactive divIcon markers and overlays
    markers.forEach(m => { if (m.getElement()) m.getElement().style.display = 'none'; });
    hideOverlaysForExport();

    // 2. Add Canvas-native markers for export (Leaflet renders these to Canvas)
    exportMarkers = [];
    visitData.forEach((item, i) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        const num = parseInt(item.Sl) || (i + 1);
        const em = createExportMarker(lat, lon, num);
        em.addTo(map);
        exportMarkers.push(em);
    });

    // 3. Wait for tiles and render
    await waitForTilesToLoad();
    map.invalidateSize({ animate: false });
    await new Promise(r => setTimeout(r, 600));

    // 4. Capture - Canvas markers are part of the Leaflet Canvas, captured by html2canvas
    const mapEl = document.getElementById('map');
    const canvas = await html2canvas(mapEl, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#f1f5f9',
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
            const clonedMap = clonedDoc.getElementById('map');
            if (clonedMap) {
                clonedMap.style.width = mapEl.offsetWidth + 'px';
                clonedMap.style.height = mapEl.offsetHeight + 'px';
            }
        }
    });

    // 5. Remove export markers and restore interactive markers
    exportMarkers.forEach(m => map.removeLayer(m));
    exportMarkers = [];
    markers.forEach(m => { if (m.getElement()) m.getElement().style.display = ''; });
    showOverlaysAfterExport();

    return canvas;
}

// ============================================
// PNG EXPORT
// ============================================

async function exportPNG() {
    if (visitData.length === 0) { alert('Please upload data first.'); return; }

    const title = document.getElementById('routeTitle').value.trim() || 'Visit Route Map';
    const subtitle = document.getElementById('routeSubtitle').value.trim();
    const date = document.getElementById('routeDate').value;
    const source = document.getElementById('routeSource').value.trim() || 'RCP';
    const created = new Date().toLocaleDateString('en-US', {day:'numeric',month:'long',year:'numeric'});

    showLoading(true);

    try {
        const mapCanvas = await captureMapForExport();

        const pad = 40;
        const headerH = subtitle ? 120 : 90;
        const footerH = 100;
        const totalW = mapCanvas.width;
        const totalH = headerH + mapCanvas.height + footerH;

        const canvas = document.createElement('canvas');
        canvas.width = totalW; canvas.height = totalH;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, totalW, totalH);

        const grad = ctx.createLinearGradient(0, 0, totalW, 0);
        grad.addColorStop(0, '#0f766e'); grad.addColorStop(1, '#115e59');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, totalW, headerH);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Inter, sans-serif';
        ctx.fillText(title, pad, 50);

        if (subtitle) {
            ctx.font = '18px Inter, sans-serif';
            ctx.globalAlpha = 0.9;
            ctx.fillText(subtitle, pad, 80);
            ctx.globalAlpha = 1;
        }

        ctx.font = '14px Inter, sans-serif';
        ctx.globalAlpha = 0.7;
        ctx.fillText(fmtDate(date), pad, subtitle ? 108 : 78);
        ctx.globalAlpha = 1;

        if (logoDataUrl) {
            try {
                const logoImg = await loadImage(logoDataUrl);
                const maxLogoH = headerH - 30;
                const maxLogoW = 180;
                const scale = Math.min(maxLogoH / logoImg.height, maxLogoW / logoImg.width, 1);
                const lw = logoImg.width * scale, lh = logoImg.height * scale;
                ctx.drawImage(logoImg, totalW - pad - lw, (headerH - lh) / 2, lw, lh);
            } catch (e) { console.warn('Logo failed to render in PNG export', e); }
        }

        ctx.drawImage(mapCanvas, 0, headerH);

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, headerH + mapCanvas.height, totalW, footerH);
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, headerH + mapCanvas.height); ctx.lineTo(totalW, headerH + mapCanvas.height); ctx.stroke();

        const fy = headerH + mapCanvas.height + 28;
        ctx.fillStyle = '#64748b'; ctx.font = '13px Inter, sans-serif';
        ctx.fillText(`Created on: ${created}  ||  Data source: ${source}`, pad, fy);

        ctx.fillStyle = '#94a3b8'; ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('Developed by Sabbir Hossain', totalW - pad, fy);
        ctx.textAlign = 'left';

        ctx.fillStyle = '#475569'; ctx.font = '11px Inter, sans-serif';
        const discText = 'Disclaimer: The boundaries and names shown and the designations used on this map do not imply official endorsement or acceptance by the United Nations.';
        wrapText(ctx, discText, pad, fy + 32, totalW - pad * 2, 18);

        const link = document.createElement('a');
        const pngNameBase = subtitle ? slugify(subtitle) : slugify(title);
        link.download = date ? `${pngNameBase}_${date}.png` : `${pngNameBase}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error('PNG export error:', err);
        alert('Export failed. Please try again.');
    } finally {
        showLoading(false);
    }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y); line = words[n] + ' '; y += lineHeight;
        } else { line = testLine; }
    }
    ctx.fillText(line, x, y);
}

// ============================================
// PDF EXPORT
// ============================================

async function exportPDF() {
    if (visitData.length === 0) { alert('Please upload data first.'); return; }

    const title = document.getElementById('routeTitle').value.trim() || 'Visit Route Map';
    const subtitle = document.getElementById('routeSubtitle').value.trim();
    const date = document.getElementById('routeDate').value;
    const source = document.getElementById('routeSource').value.trim() || 'RCP';
    const created = new Date().toLocaleDateString('en-US', {day:'numeric',month:'long',year:'numeric'});

    const totalDist = document.getElementById('totalDistance').textContent;
    const locCount = document.getElementById('locationCount').textContent;
    const driveTime = document.getElementById('estDriveTime').textContent;

    showLoading(true);

    try {
        const mapCanvas = await captureMapForExport();

        // ── Intelligent Dynamic Scaling ────────────────────────────────
        // A4 page = 210mm × 297mm. We allocate fixed space for header,
        // footer, summary, and table header. The remaining space is shared
        // between the map image and the data rows.
        //
        // CRITICAL FIX: Map aspect ratio is preserved. The map container
        // uses the captured canvas's natural aspect ratio. The container
        // height is calculated proportionally from the canvas dimensions,
        // never by forcing a fixed height that would distort the image.
        // ────────────────────────────────────────────────────────────────

        const PAGE_W = 210;
        const PAGE_H = 297;
        const MARGIN_X = 10;           // left/right page margin
        const HEADER_H = 28;             // teal gradient header
        const FOOTER_H = 22;             // disclaimer + credits
        const SUMMARY_H = 18;            // 3-column stats bar
        const TABLE_HEAD_H = 8;          // table header row
        const GAP = 3;                   // gap between sections
        const CONTENT_W = PAGE_W - (MARGIN_X * 2);  // usable content width

        const n = visitData.length;

        // ── 1. Row-height budget ───────────────────────────────────────
        let rowH;
        if (n <= 6)       rowH = 9.0;
        else if (n <= 10) rowH = 7.0;
        else if (n <= 18) rowH = 5.5;
        else if (n <= 30) rowH = 4.8;
        else              rowH = 4.5;   // absolute floor

        const tableBodyH = n * rowH;
        const tableTotalH = TABLE_HEAD_H + tableBodyH;

        // ── 2. Map height: preserve aspect ratio ──────────────────────
        // Calculate the map's natural proportional height based on the
        // captured canvas dimensions and the PDF content width.
        const canvasRatio = mapCanvas.height / mapCanvas.width;  // h/w
        const naturalMapH = CONTENT_W * canvasRatio;              // proportional height in mm

        // ── 3. Content budget check ───────────────────────────────────
        const fixedH = HEADER_H + FOOTER_H + SUMMARY_H + tableTotalH + (GAP * 4);
        const availableForMap = PAGE_H - fixedH;

        // If natural height fits, use it. If not, squeeze OTHER elements
        // (reduce summary padding, shrink table more, reduce gaps) rather
        // than distorting the map.
        let mapH, usedMapH;
        if (naturalMapH <= availableForMap) {
            // Natural height fits — use it for perfect aspect ratio
            mapH = naturalMapH;
            usedMapH = mapH;
        } else {
            // Natural height exceeds available space. We MUST keep aspect ratio,
            // so we squeeze the non-map elements instead.
            // Strategy: reduce row height further, shrink gaps, compress summary.
            let squeezedRowH = rowH;
            let squeezedGap = GAP;
            let squeezedSumH = SUMMARY_H;

            // Iteratively squeeze until map fits or we hit floors
            while (naturalMapH > (PAGE_H - (HEADER_H + FOOTER_H + squeezedSumH + (TABLE_HEAD_H + n * squeezedRowH) + (squeezedGap * 4)))) {
                if (squeezedRowH > 4.0) { squeezedRowH -= 0.2; continue; }
                if (squeezedGap > 1) { squeezedGap -= 0.5; continue; }
                if (squeezedSumH > 12) { squeezedSumH -= 1; continue; }
                break; // can't squeeze any more
            }

            // Recalculate with squeezed values
            rowH = squeezedRowH;
            const squeezedTableH = TABLE_HEAD_H + (n * rowH);
            const squeezedFixedH = HEADER_H + FOOTER_H + squeezedSumH + squeezedTableH + (squeezedGap * 4);
            mapH = PAGE_H - squeezedFixedH;

            // Absolute safety: if still negative, clamp to minimum and let
            // downloadPDF's uniform scale handle the rest
            if (mapH < 25) mapH = 25;
            usedMapH = mapH;
        }

        // ── 4. Font sizes derived from row height ───────────────────────
        const bodyFont = Math.max(7, Math.min(11, Math.round(rowH * 1.9)));
        const subFont  = Math.max(6.5, bodyFont - 1);
        const headFont = Math.max(6.5, Math.min(9, bodyFont - 0.5));
        const sumFont  = Math.max(9, Math.min(16, Math.round(usedMapH * 0.12)));

        // ── 5. Padding derived from row height ─────────────────────────
        const vPad = Math.max(1, Math.min(4, Math.round((rowH - bodyFont * 0.35) / 2)));
        const hPad = 5;
        const rowPad = `${vPad}px ${hPad}px`;
        const headPad = `${vPad}px ${hPad}px`;
        const sumPad = `${Math.max(3, Math.min(8, Math.round(usedMapH * 0.03)))}px`;

        // ── 6. Build table rows ─────────────────────────────────────────
        let visitsHTML = '';
        visitData.forEach((item, i) => {
            const num = parseInt(item.Sl) || (i+1);
            visitsHTML += `
                <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:${rowPad};font-size:${bodyFont}px;font-weight:700;color:#0d9488;vertical-align:top;text-align:center;">${num}</td>
                    <td style="padding:${rowPad};font-size:${bodyFont}px;color:#1e293b;font-weight:600;vertical-align:top;word-break:break-word;">${escapeHtml(clean(item.Activity))||'--'}</td>
                    <td style="padding:${rowPad};font-size:${subFont}px;color:#475569;vertical-align:top;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(clean(item.Time))||'--'}</td>
                    <td style="padding:${rowPad};font-size:${subFont}px;color:#475569;vertical-align:top;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(clean(item.Duration))||'--'}</td>
                    <td style="padding:${rowPad};font-size:${subFont}px;color:#475569;vertical-align:top;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(clean(item.Camp))||'--'}</td>
                    <td style="padding:${rowPad};font-size:${subFont}px;color:#475569;vertical-align:top;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(clean(item.Agency))||'--'}</td>
                </tr>`;
        });

        // ── 7. Assemble preview HTML ────────────────────────────────────
        // CRITICAL: Map uses object-fit:contain with explicit width/height
        // to preserve aspect ratio. The container is centered with a subtle
        // background so any letterboxing is visually clean.
        const previewHTML = `
            <div id="pdfExportRoot" style="padding:0;font-family:Inter,system-ui,-apple-system,sans-serif;color:#1e293b;width:${PAGE_W}mm;box-sizing:border-box;">
                <!-- Header -->
                <div style="background:linear-gradient(135deg,#0f766e 0%,#115e59 100%);color:white;padding:10px ${MARGIN_X}mm;position:relative;height:${HEADER_H}mm;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;">
                    ${logoDataUrl?`<img src="${logoDataUrl}" style="position:absolute;top:8px;right:${MARGIN_X}mm;max-height:22px;max-width:60px;object-fit:contain;background:white;padding:2px 4px;border-radius:4px;">`:''}
                    <h1 style="font-size:15px;font-weight:800;margin:0;letter-spacing:-0.3px;line-height:1.2;${logoDataUrl?'max-width:78%;':''}">${escapeHtml(title)}</h1>
                    ${subtitle?`<p style="font-size:10px;margin:3px 0 0 0;opacity:0.9;line-height:1.2;${logoDataUrl?'max-width:78%;':''}">${escapeHtml(subtitle)}</p>`:''}
                    <p style="font-size:8px;margin:4px 0 0 0;opacity:0.7;">${fmtDate(date)}</p>
                </div>

                <!-- Map: aspect-ratio preserved with object-fit:contain -->
                <div style="padding:${sumPad} ${MARGIN_X}mm 0;background:#f8fafc;text-align:center;">
                    <div style="width:100%;height:${usedMapH}mm;background:#e2e8f0;border-radius:6px;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                        <img src="${mapCanvas.toDataURL('image/png')}" style="max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block;">
                    </div>
                </div>

                <!-- Summary Stats -->
                <div style="display:flex;gap:8px;margin:${sumPad} ${MARGIN_X}mm;padding:${sumPad};background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;box-sizing:border-box;">
                    <div style="flex:1;text-align:center;">
                        <p style="font-size:${sumFont}px;font-weight:700;color:#0d9488;margin:0;line-height:1;">${locCount}</p>
                        <p style="font-size:8px;color:#64748b;margin:2px 0 0 0;">Locations</p>
                    </div>
                    <div style="flex:1;text-align:center;border-left:1px solid #e2e8f0;">
                        <p style="font-size:${sumFont}px;font-weight:700;color:#0d9488;margin:0;line-height:1;">${totalDist}</p>
                        <p style="font-size:8px;color:#64748b;margin:2px 0 0 0;">Total Distance</p>
                    </div>
                    <div style="flex:1;text-align:center;border-left:1px solid #e2e8f0;">
                        <p style="font-size:${sumFont}px;font-weight:700;color:#0d9488;margin:0;line-height:1;">${driveTime}</p>
                        <p style="font-size:8px;color:#64748b;margin:2px 0 0 0;">Est. Drive Time</p>
                    </div>
                </div>

                <!-- Visit Schedule Table -->
                <div style="padding:0 ${MARGIN_X}mm ${sumPad};">
                    <h2 style="font-size:10px;font-weight:700;color:#0f766e;margin:0 0 4px 0;padding-bottom:3px;border-bottom:1.5px solid #0d9488;text-transform:uppercase;letter-spacing:0.5px;">Visit Schedule</h2>
                    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
                        <colgroup>
                            <col style="width:5%;">
                            <col style="width:30%;">
                            <col style="width:20%;">
                            <col style="width:15%;">
                            <col style="width:15%;">
                            <col style="width:15%;">
                        </colgroup>
                        <thead>
                            <tr style="background:#f0fdfa;">
                                <th style="padding:${headPad};font-size:${headFont}px;font-weight:700;color:#0f766e;text-align:left;">#</th>
                                <th style="padding:${headPad};font-size:${headFont}px;font-weight:700;color:#0f766e;text-align:left;">Activity</th>
                                <th style="padding:${headPad};font-size:${headFont}px;font-weight:700;color:#0f766e;text-align:left;">Time</th>
                                <th style="padding:${headPad};font-size:${headFont}px;font-weight:700;color:#0f766e;text-align:left;">Dur.</th>
                                <th style="padding:${headPad};font-size:${headFont}px;font-weight:700;color:#0f766e;text-align:left;">Camp</th>
                                <th style="padding:${headPad};font-size:${headFont}px;font-weight:700;color:#0f766e;text-align:left;">Agency</th>
                            </tr>
                        </thead>
                        <tbody>${visitsHTML}</tbody>
                    </table>
                </div>

                <!-- Footer -->
                <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:6px ${MARGIN_X}mm;box-sizing:border-box;">
                    <div style="display:flex;justify-content:space-between;align-items:baseline;margin:0 0 3px 0;">
                        <p style="font-size:7px;color:#94a3b8;margin:0;">Created: ${created} &nbsp;|&nbsp; Source: ${escapeHtml(source)}</p>
                        <p style="font-size:7px;color:#94a3b8;margin:0;">Developed by Sabbir Hossain</p>
                    </div>
                    <div style="font-size:7px;color:#64748b;line-height:1.3;border-left:2px solid #0d9488;padding-left:6px;background:#f0fdfa;padding:3px 6px;border-radius:0 4px 4px 0;">
                        <strong>Disclaimer:</strong> The boundaries and names shown and the designations used on this map do not imply official endorsement or acceptance by the United Nations.
                    </div>
                </div>
            </div>`;

        document.getElementById('pdfPreviewContainer').innerHTML = previewHTML;
        document.getElementById('pdfModal').classList.remove('hidden');
    } catch (err) {
        console.error('PDF export error:', err);
        alert('PDF export failed. Please try again.');
    } finally {
        showLoading(false);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const title = document.getElementById('routeTitle').value.trim() || 'Visit Route Map';
    const subtitle = document.getElementById('routeSubtitle').value.trim();
    const date = document.getElementById('routeDate').value;
    const element = document.getElementById('pdfPreviewContainer');

    showLoading(true);

    html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
            const root = clonedDoc.getElementById('pdfExportRoot');
            if (root) {
                root.style.width = '210mm';
                root.style.maxWidth = '210mm';
                root.style.overflow = 'hidden';
            }
        }
    }).then(canvas => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageW = 210, pageH = 297;
        const marginTop = 0.5, marginBottom = 0.5;
        const contentH = pageH - marginTop - marginBottom;

        // Calculate image dimensions to fit within content area (with 0.5mm top/bottom margins)
        const imgRatio = canvas.width / canvas.height;
        const contentRatio = pageW / contentH;

        let imgW, imgH, x, y;

        if (imgRatio > contentRatio) {
            // Image is wider relative to content area — fit to width
            imgW = pageW;
            imgH = imgW / imgRatio;
            x = 0;
            y = marginTop + (contentH - imgH) / 2;
        } else {
            // Image is taller relative to content area — fit to height
            imgH = contentH;
            imgW = imgH * imgRatio;
            x = (pageW - imgW) / 2;
            y = marginTop;
        }

        // Ensure we never exceed content bounds (safety clamp)
        if (imgW > pageW) { imgW = pageW; imgH = imgW / imgRatio; x = 0; y = marginTop + (contentH - imgH) / 2; }
        if (imgH > contentH) { imgH = contentH; imgW = imgH * imgRatio; y = marginTop; x = (pageW - imgW) / 2; }

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, imgW, imgH);

        const pdfNameBase = subtitle ? slugify(subtitle) : slugify(title);
        const pdfName = date ? `${pdfNameBase}_${date}.pdf` : `${pdfNameBase}.pdf`;
        pdf.save(pdfName);
        document.getElementById('pdfModal').classList.add('hidden');
        showLoading(false);
    }).catch(err => {
        console.error('PDF download error:', err);
        alert('PDF download failed. Please try again.');
        showLoading(false);
    });
}
// ============================================
// SAMPLE DATA
// ============================================

async function loadSampleData() {
    const sample = [
        {Sl:'1',Time:'10:30 - 11:15',Duration:'(45 min)',Activity:'Hatimora Aggregation Center',Camp:'Ukhiya',Agency:'WFP-FAO',lat:21.2526912,lon:92.1724337},
        {Sl:'2',Time:'11:20 - 11:40',Duration:'(20 min)',Activity:'Homestead Gardening Egg Plant Cultivation',Camp:'Rajapalong Ukhiya',Agency:'WFP',lat:21.254092,lon:92.154327},
        {Sl:'3',Time:'11:50 - 12:10',Duration:'(20 min)',Activity:'Homestead Gardening Long Beam Cultivation',Camp:'Rajapalong Ukhiya',Agency:'WFP',lat:21.254807,lon:92.158063},
        {Sl:'4',Time:'12:35 - 13:15',Duration:'(40 min)',Activity:'WGSS Meeting with Women Support Group',Camp:'Ratnapalong Ukhiya',Agency:'IOM',lat:21.272312,lon:92.108057},
        {Sl:'5',Time:'13:25 - 13:45',Duration:'(20 min)',Activity:'Small Infrastructure Construction Site',Camp:'Ratnapalong Ukhiya',Agency:'IOM',lat:21.27532,lon:92.10466},
        {Sl:'6',Time:'14:05 - 14:50',Duration:'(45 min)',Activity:'Self-help Group Shop',Camp:'Jaliapalong Ukhiya',Agency:'IOM',lat:21.286516,lon:92.05388}
    ];
    document.getElementById('routeTitle').value = "Bangladesh, Cox's Bazar: Rohingya Refugee Response";
    document.getElementById('routeSubtitle').value = "Donor field mission";
    document.getElementById('routeDate').value = "2026-07-01";
    document.getElementById('routeSource').value = "RCP";
    showLoading(true);
    visitData = sample; currentRouteId = null;
    updateMapOverlay("Bangladesh, Cox's Bazar: Rohingya Refugee Response", "Donor field mission", "2026-07-01", "RCP");
    await renderRoute(sample); renderSidebar(sample, 'visitList'); showLoading(false);
}

// ============================================
// UI HELPERS
// ============================================

function showLoading(show) { document.getElementById('loadingOverlay').classList.toggle('hidden', !show); }
function showOSRMLoading(show) { document.getElementById('osrmLoading').classList.toggle('hidden', !show); }

function setRouteMode(realRoute) {
    useRealRoute = realRoute;
    const br = document.getElementById('btnRealRoute'), bd = document.getElementById('btnDirectRoute');
    if (realRoute) {
        br.className = 'flex-1 px-3 py-2 bg-teal-600 text-white text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5';
        bd.className = 'flex-1 px-3 py-2 bg-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-300 transition flex items-center justify-center gap-1.5';
    } else {
        br.className = 'flex-1 px-3 py-2 bg-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-300 transition flex items-center justify-center gap-1.5';
        bd.className = 'flex-1 px-3 py-2 bg-teal-600 text-white text-xs font-medium rounded-lg transition flex items-center justify-center gap-1.5';
    }
    if (visitData.length > 0) renderRoute(visitData);
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initMap(); renderSavedRoutes();
    updateLogoDisplay();

    const sharedRouteId = getUrlParam('route');
    const sharedRouteUrl = getUrlParam('src');
    if (sharedRouteId) enterViewerMode(sharedRouteId);
    else if (sharedRouteUrl) enterViewerModeFromUrl(sharedRouteUrl);

    // File upload
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
    uploadZone.addEventListener('drop', e => {
        e.preventDefault(); uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) processCSV(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', e => { if (e.target.files.length > 0) processCSV(e.target.files[0]); });

    // Logo upload
    const logoInput = document.getElementById('logoInput');
    const logoUploadZone = document.getElementById('logoUploadZone');
    logoUploadZone.addEventListener('click', e => { if (e.target.id !== 'btnRemoveLogo') logoInput.click(); });
    logoUploadZone.addEventListener('dragover', e => { e.preventDefault(); logoUploadZone.classList.add('dragover'); });
    logoUploadZone.addEventListener('dragleave', () => logoUploadZone.classList.remove('dragover'));
    logoUploadZone.addEventListener('drop', e => {
        e.preventDefault(); logoUploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) processLogoFile(e.dataTransfer.files[0]);
    });
    logoInput.addEventListener('change', e => { if (e.target.files.length > 0) processLogoFile(e.target.files[0]); });
    document.getElementById('btnRemoveLogo').addEventListener('click', e => { e.stopPropagation(); removeLogo(); });

    // CSV template download
    document.getElementById('btnDownloadTemplate').addEventListener('click', downloadCSVTemplate);

    // Metadata updates
    ['routeTitle','routeSubtitle','routeDate','routeSource'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', () => {
            if (!isViewerMode) updateMapOverlay(
                document.getElementById('routeTitle').value,
                document.getElementById('routeSubtitle').value,
                document.getElementById('routeDate').value,
                document.getElementById('routeSource').value
            );
        });
    });

    // Buttons
    document.getElementById('btnExportPNG').addEventListener('click', exportPNG);
    document.getElementById('btnExportPDF').addEventListener('click', exportPDF);
    document.getElementById('btnLoadSample').addEventListener('click', loadSampleData);
    document.getElementById('btnRealRoute').addEventListener('click', () => setRouteMode(true));
    document.getElementById('btnDirectRoute').addEventListener('click', () => setRouteMode(false));
    document.getElementById('btnViewMode').addEventListener('click', exitViewerMode);
    document.getElementById('sidebarToggleBtn').addEventListener('click', toggleSidebar);

    // Save modal
    document.getElementById('btnSaveRoute').addEventListener('click', openSaveModal);
    document.getElementById('btnCloseSaveModal').addEventListener('click', closeSaveModal);
    document.getElementById('btnConfirmSave').addEventListener('click', confirmSaveRoute);
    document.getElementById('btnDownloadJSON').addEventListener('click', downloadCurrentJSON);

    // Share modal
    document.getElementById('btnCloseShareModal').addEventListener('click', () => document.getElementById('shareModal').classList.add('hidden'));
    document.getElementById('btnCopyLink').addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('shareLinkBox').textContent).then(() => {
            const btn = document.getElementById('btnCopyLink');
            const orig = btn.innerHTML;
            btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Copied!';
            setTimeout(() => btn.innerHTML = orig, 2000);
        });
    });
    document.getElementById('btnDownloadShareJSON').addEventListener('click', downloadCurrentJSON);
    document.getElementById('btnGenerateGithubLink').addEventListener('click', () => {
        const rawUrl = document.getElementById('rawUrlInput').value.trim();
        const box = document.getElementById('githubShareLinkBox');
        const copyBtn = document.getElementById('btnCopyGithubLink');
        if (!rawUrl) { alert('Paste the raw GitHub URL of the JSON file first.'); return; }
        const link = buildGithubShareLink(rawUrl);
        box.textContent = link;
        box.classList.remove('hidden');
        copyBtn.classList.remove('hidden');
    });
    document.getElementById('btnCopyGithubLink').addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('githubShareLinkBox').textContent).then(() => {
            const btn = document.getElementById('btnCopyGithubLink');
            const orig = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = orig, 2000);
        });
    });

    // GitHub one-click publish
    document.getElementById('btnPublishGithub').addEventListener('click', async () => {
        const title = document.getElementById('routeTitle').value.trim();
        if (!title) { alert('Please add a Route Title before publishing.'); return; }
        if (visitData.length === 0) { alert('Please upload visit data before publishing.'); return; }

        const btn = document.getElementById('btnPublishGithub');
        const origHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Publishing…';

        const routeData = {
            id: currentRouteId || generateRouteId(),
            title: title,
            subtitle: document.getElementById('routeSubtitle').value.trim(),
            date: document.getElementById('routeDate').value,
            source: document.getElementById('routeSource').value.trim() || 'RCP',
            createdAt: new Date().toISOString(),
            visits: visitData,
            logo: logoDataUrl || null
        };

        const link = await publishRouteToGithub(routeData);

        btn.disabled = false;
        btn.innerHTML = origHtml;

        if (link) {
            const box = document.getElementById('githubShareLinkBox');
            const copyBtn = document.getElementById('btnCopyGithubLink');
            box.textContent = link;
            box.classList.remove('hidden');
            copyBtn.classList.remove('hidden');
        }
    });

    // GitHub settings modal
    function loadGhSettingsIntoForm() {
        const s = getGithubSettings() || {};
        document.getElementById('ghOwner').value = s.owner || '';
        document.getElementById('ghRepo').value = s.repo || '';
        document.getElementById('ghBranch').value = s.branch || 'main';
        document.getElementById('ghFolder').value = s.folder || 'routes';
        document.getElementById('ghToken').value = s.token || '';
    }
    document.getElementById('btnOpenGhSettingsInline').addEventListener('click', () => {
        loadGhSettingsIntoForm();
        document.getElementById('ghSettingsModal').classList.remove('hidden');
    });
    document.getElementById('btnCloseGhSettings').addEventListener('click', () => {
        document.getElementById('ghSettingsModal').classList.add('hidden');
    });
    document.getElementById('btnSaveGhSettings').addEventListener('click', () => {
        const s = {
            owner: document.getElementById('ghOwner').value.trim(),
            repo: document.getElementById('ghRepo').value.trim(),
            branch: document.getElementById('ghBranch').value.trim() || 'main',
            folder: document.getElementById('ghFolder').value.trim() || 'routes',
            token: document.getElementById('ghToken').value.trim()
        };
        if (!s.owner || !s.repo || !s.token) { alert('Username, repository, and token are required.'); return; }
        saveGithubSettings(s);
        document.getElementById('ghSettingsModal').classList.add('hidden');
    });
    document.getElementById('btnClearGhSettings').addEventListener('click', () => {
        if (confirm('Remove the saved GitHub token from this browser?')) {
            localStorage.removeItem(GH_SETTINGS_KEY);
            loadGhSettingsIntoForm();
        }
    });

    // Live location tracking (viewer mode)
    document.getElementById('btnTrackLocation').addEventListener('click', toggleLocationTracking);

    // Mobile viewer layout: tap-to-expand title, Route Summary/Disclaimer sheet
    document.getElementById('btnToggleTitleDetails').addEventListener('click', toggleTitleDetails);
    document.getElementById('mobileInfoFab').addEventListener('click', openMobileInfoSheet);
    document.getElementById('btnCloseMobileSheet').addEventListener('click', closeMobileInfoSheet);
    document.getElementById('mobileInfoSheetBackdrop').addEventListener('click', closeMobileInfoSheet);

    // PDF modal
    document.getElementById('btnClosePDFModal').addEventListener('click', () => document.getElementById('pdfModal').classList.add('hidden'));
    document.getElementById('btnCancelPDF').addEventListener('click', () => document.getElementById('pdfModal').classList.add('hidden'));
    document.getElementById('btnDownloadPDF').addEventListener('click', downloadPDF);

    // Modal overlay clicks
    ['saveModal','shareModal','pdfModal'].forEach(id => {
        document.getElementById(id).addEventListener('click', e => {
            if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
        });
    });

    applyMobileLayout();
    window.addEventListener('resize', () => {
        if (map) setTimeout(() => map.invalidateSize({ animate: false }), 150);
    });
    setTimeout(loadSampleData, 500);
});
