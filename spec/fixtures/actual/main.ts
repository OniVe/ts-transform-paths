import { legacy as legacyFile } from "@dir/legacy";
import { constFile as dirConstFile } from "@dir/const-file";
import { constIndex as dirConstIndex } from "@dir/const-index";
import { module1 as dirModule1 } from "@dir/module-file";
import { module2 as dirModule2 } from "@dir/module-index";
import { constFile as subdirConstFile } from "@dir/subdir/const-file";
import { constIndex as subdirConstIndex } from "@dir/subdir/const-index";
import { module1 as subdirModule1 } from "@dir/subdir/module-file";
import { module2 as subdirModule2 } from "@dir/subdir/module-index";

legacyFile();
dirConstFile();
dirConstIndex();
dirModule1();
dirModule2();

subdirConstFile();
subdirConstIndex();
subdirModule1();
subdirModule2();
