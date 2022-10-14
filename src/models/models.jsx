export class UserModel {
    constructor(id, name, lastname, phone, password, roleId, updatedAt, createdAt) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.phone = phone;
        this.password = password;
        this.roleId = roleId;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }
}

export class LineaModel {
    constructor(
        id,
        name,
        description,
        phone,
        directionLat = "-17.783957",
        directionLon = "-63.181132",
        colorBg = 'ffffff',
        colorPr = '3c3c3c',
        updatedAt,
        createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.directionLat = directionLat;
        this.directionLon = directionLon;
        this.colorBg = colorBg;
        this.colorPr = colorPr;
        this.phone = phone;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }
}

export const LineaModelJson = ()=> ({
    id: null,
    name: null,
    description: null,
    directionLat: -17.783957,
    directionLon: -63.181132,
    colorBg: 'ffffff',
    colorPr: '3c3c3c',
    phone: null,
    updatedAt: null,
    createdAt: null,
});

export const UserModelJson = ()=> ({
    id: "",
    name: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
    roleId: "",
    updatedAt: "",
    createdAt: ""
});

export const RoleModelJson = ()=> ({
    id: null,
    name: null,
    description: null,
    updatedAt: null,
    createdAt: null
});

export const InternoModelJson = ()=> ({
    id: "",
    name: "",
    userId: "",
    lineaId: "",
    updatedAt: "",
    createdAt: ""
});
